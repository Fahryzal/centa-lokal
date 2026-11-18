import { PrismaService } from '@modules/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { Module, TransactionType, TransactionTypeMapping } from '@prisma/client';
import { QueryParams, QueryParamValue } from '@shared/types/index.types';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { isNull } from 'lodash';
import { Request } from 'express';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { jwtDecode } from 'jwt-decode';

type TaxOptions = {
	ppnRate?: number; // contoh: 0.11 untuk 11%
	pph23Rate?: number; // contoh: 0.02 untuk 2%
	pph22Rate?: number; // contoh: 0.015 untuk 1.5%
};

type TaxCalculationResult = {
	dpp: number;
	ppn: number;
	pph23: number;
	pph22: number;
	amount: number;
};

type JournalInput = {
	module: Module;
	transactionType: TransactionTypeMapping;
	baseAmountDebit?: number;
	baseAmountCredit?: number;
	unitId: string;
	additional?: {
		usage: string;
		// position: 'DEBIT' | 'CREDIT';
		amount: number;
	}[];
};

type Invoice = {
	tax: number;
	adminFee: number;
	// Tambahkan properti lain yang ada pada objek Invoice sesuai kebutuhan
};

type AdditionalEntry = {
	usage: string;
	position: 'DEBIT' | 'CREDIT';
	amount: number;
};

type TaxInput = {
	amount: number; // Nominal tagihan (bruto atau sudah termasuk PPN)
	taxType?: 'PPh 22' | 'PPh 21' | 'PPh 22' | 'PPh 23' | 'PPN 11%'; // Pajak yang dipotong (optional)
	vatIncluded?: boolean; // Apakah harga sudah termasuk PPN (optional)
	vatRate?: number; // Default 10%
	withholdingRate?: number; // Nilai PPh (jika tidak ditentukan berdasarkan taxType)
};

type TaxCalculationResultTax = {
	grossAmount: number; // Total tagihan sebelum potongan
	netPaid: number; // Uang yang benar-benar dibayarkan
	taxWithheld?: number; // Potongan PPh (jika ada)
	vatInput?: number; // PPN masukan (jika ada)
};

function isQueryParamValue(value: unknown): value is QueryParamValue {
	return value != null; //test
}

@Injectable()
export class HelperGlobal {
	constructor(
		//TODO:
		private prisma: PrismaService
	) {}

	excludeFieldsPrisma(fieldsToExclude: string[], modelFields: any) {
		const select: any = {};
		for (const field in modelFields) {
			if (!fieldsToExclude.includes(field)) {
				select[field] = true;
			}
		}
		return select;
	}

	snakeToCamelCase(snakeObj: any, text?: string): any {
		const camelObj: any = {};
		for (const key in snakeObj) {
			let camelKey = key;

			// Jika key mengandung "text" diawal kata, hapus "text" dan ubah ke camelCase
			if (key.startsWith(text)) {
				camelKey = key.replace(text, ''); // Hapus "text"
				camelKey = camelKey.replace(/_([a-z])/g, (g) => g[1].toUpperCase()); // Ubah ke camelCase
			} else {
				// Konversi key lainnya ke camelCase biasa
				camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
			}

			camelObj[camelKey] = snakeObj[key];
		}
		return camelObj;
	}

	camelToSnakeCase(camelObj: any): any {
		const snakeObj: any = {};
		for (const key in camelObj) {
			const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
			snakeObj[snakeKey] = camelObj[key];
		}
		return snakeObj;
	}

	formatBodyRes(res: any, frmt: any, keyInObjek: any): any {
		const asignObj = {};
		Object.keys(frmt).forEach((key) => {
			if (keyInObjek.includes(key) && typeof frmt[key] === 'object' && !Array.isArray(frmt[key])) {
				asignObj[key] = {};
				Object.keys(frmt[key]).forEach((k) => {
					if (Object.keys(res).includes(k)) {
						asignObj[key][k] = res[k];
					} else if (frmt[key]) {
						asignObj[key][k] = frmt[key][k];
					} else {
						asignObj[key][k] = null;
					}
				});
			} else if (Array.isArray(frmt[key])) {
				let hasil = [];
				const data = res[key];
				data.forEach((child: any) => {
					hasil = frmt[key].map((keyArray: any) => {
						const objeArray = {};
						Object.keys(keyArray).forEach((keyObjek) => {
							if (typeof keyArray[keyObjek] === 'string') {
								objeArray[keyObjek] = child[keyObjek] || null;
							} else if (typeof keyArray[keyObjek] === 'object') {
								objeArray[keyObjek] = {};
								Object.keys(keyArray[keyObjek]).forEach((keyChild1) => {
									objeArray[keyObjek][keyChild1] = child[keyChild1] || null;
								});
							}
						});
						return objeArray;
					});
				});
				asignObj[key] = hasil;
			} else {
				asignObj[key] = res[key] || frmt[key] || null;
			}
		});

		return asignObj;
	}

	formatBodyResV2(res: any, frmt: any): any {
		function formatObject(source: any, template: any): any {
			const result: any = {};
			for (const key in template) {
				if (Array.isArray(template[key])) {
					result[key] = (source[key] || []).map((item: any) => formatObject(item, template[key][0]));
				} else if (typeof template[key] === 'object' && template[key] !== null && !Array.isArray(template[key])) {
					result[key] = formatObject(source, template[key]);
				} else {
					// mengisi value objek, saat type data berupa string/number
					result[key] = source[key] ?? template[key] ?? null;
				}
			}

			return result || null;
		}

		return formatObject(res, frmt);
	}
	buildQueryParams(params: QueryParams): string {
		return Object.entries(params) //
			.filter(([_, value]) => isQueryParamValue(value)) // hilangkan key, jika value null/undefined
			.map(([key, value]) => {
				const encodedKey = encodeURIComponent(key);
				//cek jika params bertype array
				if (Array.isArray(value)) {
					return value.map((v) => `${encodedKey}=${encodeURIComponent(String(v))}`).join('&');
				}
				// jika params bukan array
				return `${encodedKey}=${encodeURIComponent(String(value))}`;
			})
			.join('&');
	}

	convertStatusHanlde(status: string) {
		if (status === 'DRAFT' || status === 'NORMAL') {
			return 'Normal';
		} else if (status === 'DRAFT PENGGANTI' || status === 'NORMAL PENGGANTI') {
			return 'Normal-Pengganti';
		} else if (status === 'DIBATALKAN') {
			return 'Batal';
		} else if (status === 'DIGANTI') {
			return 'Diganti';
		} else {
			return status;
		}
	}

	convertStatusApproveHanlde(status: string, status_message: string) {
		if ((status === 'DRAFT' || status === 'DRAFT PENGGANTI') && isNull(status_message)) {
			return 'Belum Approve';
		} else if (status === 'DRAFT' || (status === 'DRAFT PENGGANTI' && !isNull(status_message))) {
			return 'Reject';
		} else if (status === 'NORMAL' || status === 'NORMAL PENGGANTI' || status === 'DIGANTI') {
			return 'Approval Sukses';
		} else if (status === 'DIBATALKAN') {
			return 'Batal Sukses';
		} else {
			return status;
		}
	}

	transformKeyObjResArray(responseArray: any[], type: any) {
		return responseArray.map((response) => {
			const transformed = plainToInstance(type, response, {
				excludeExtraneousValues: true,
				enableImplicitConversion: true,
			});
			return JSON.parse(JSON.stringify(transformed));
		});
	}

	transformKeyObj(responseObjek: any, type: any) {
		const transformed = plainToInstance(type, responseObjek, {
			excludeExtraneousValues: true,
			enableImplicitConversion: true,
		});
		return JSON.parse(JSON.stringify(transformed));
	}

	buildOrderBy(sortField: string, sortOrder: string) {
		if (!sortField) return undefined;

		const parts = sortField.split(',');

		// Jika field biasa, contoh: "nama"
		if (parts.length === 1) {
			return {
				[sortField]: sortOrder,
			};
		}

		// Jika relasi, contoh: "kategori.nama"
		if (parts.length === 2) {
			const [relation, field] = parts;
			return {
				[relation]: {
					[field]: sortOrder,
				},
			};
		}

		// Handle lebih dari satu level relasi kalau perlu
		throw new Error('Nested orderBy lebih dari 1 level belum didukung');
	}

	/**
	 * Menghitung DPP, PPN, PPh 23, dan amount bersih yang diterima penjual.
	 * @param grossAmount Total tagihan (DPP + PPN)
	 * @returns Perincian pajak dan kas masuk (amount)
	 */
	calculateNetAmount(grossAmount: number, options: TaxOptions = {}): TaxCalculationResult {
		const { ppnRate = 0, pph23Rate = 0, pph22Rate = 0 } = options;

		const dpp = grossAmount / (1 + ppnRate);
		const ppn = dpp * ppnRate;
		const pph23 = dpp * pph23Rate;
		const pph22 = dpp * pph22Rate;
		const amount = grossAmount - pph23 - pph22;

		return {
			dpp: Math.round(dpp),
			ppn: Math.round(ppn),
			pph23: Math.round(pph23),
			pph22: Math.round(pph22),
			amount: Math.round(amount),
		};
	}

	// contoh penggunaan
	// const result = calculateNetAmount(1110000, {
	// 	ppnRate: 0.11,
	// 	pph23Rate: 0.02
	//   })
	//   console.log(result)
	// Output:
	// { dpp: 1000000, ppn: 110000, pph23: 20000, pph22: 0, amount: 1090000 }

	async getMappedAccount(
		module: Module,
		transactionType: TransactionTypeMapping,
		position: 'DEBIT' | 'CREDIT',
		usage: string
	) {
		const account = await this.prisma.accountMapping.findFirst({
			where: { module, transactionType, position, usage },
		});
		if (!account) throw new Error(`Mapping tidak ditemukan untuk ${module} - ${transactionType} - ${position} - ${usage}`);
		return account.accountCode;
	}
	// const debitAkun = await getMappedAccount('PRODUCTION', 'MATERIAL_RECEIPT', 'DEBIT', 'barang_jadi');
	// const kreditAkun = await getMappedAccount('PRODUCTION', 'MATERIAL_RECEIPT', 'CREDIT', 'biaya_produksi');

	async getMappedAccountV2(
		module: Module,
		transactionType: TransactionTypeMapping,
		position: 'DEBIT' | 'CREDIT',
		usage: string
	) {
		const mapping = await this.prisma.accountMapping.findFirst({
			where: { module, transactionType, position, usage },
		});

		if (!mapping) {
			throw new Error(`Mapping akun tidak ditemukan: ${module} - ${transactionType} - ${position} - ${usage}`);
		}

		return mapping.accountCode;
	}

	async generateJournalEntries({
		module,
		transactionType,
		amount,
		additional = [],
	}: {
		module: Module;
		transactionType: TransactionTypeMapping;
		amount: number;
		additional?: {
			usage: string;
			position: 'DEBIT' | 'CREDIT';
			amount: number;
		}[];
	}) {
		const debitAkun = await this.getMappedAccount(module, transactionType, 'DEBIT', 'piutang');
		const creditAkun = await this.getMappedAccount(module, transactionType, 'CREDIT', 'pendapatan');

		const entries = [
			{ accountCode: debitAkun, debit: amount, credit: 0 },
			{ accountCode: creditAkun, debit: 0, credit: amount },
		];

		// tambahkan biaya admin, ppn, dll
		for (const add of additional) {
			const accId = await this.getMappedAccount(module, transactionType, add.position, add.usage);
			entries.push({
				accountCode: accId,
				debit: add.position === 'DEBIT' ? add.amount : 0,
				credit: add.position === 'CREDIT' ? add.amount : 0,
			});
		}

		return entries;
	}

	//TODO: Contoh pemakaia
	// const entries = await this.generateJournalEntries({
	//   module: 'SALES',
	//   transactionType: 'INVOICE',
	//   amount: 10000000,
	//   additional: [
	//     { usage: 'ppn', position: 'CREDIT', amount: 1100000 },
	//     { usage: 'biaya_admin', position: 'DEBIT', amount: 100000 },
	//   ],
	// });

	validateJournalBalance(entries: { debit: number | null; credit: number | null }[]) {
		const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
		const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
		if (totalDebit !== totalCredit) {
			throw new Error(`Jurnal tidak seimbang. Debit: ${totalDebit}, Kredit: ${totalCredit}`);
		}
	}
	async generateJournalEntriesFromMapping(input: JournalInput) {
		const { module, transactionType, baseAmountDebit, baseAmountCredit, additional = [] } = input;

		// Ambil semua mapping akun untuk modul dan jenis transaksi ini
		const mappings = await this.prisma.accountMapping.findMany({
			where: {
				module,
				transactionType,
			},
		});
		if (mappings.length === 0) {
			throw new Error(`Mapping jurnal tidak ditemukan untuk module=${module}, transactionType=${transactionType}`);
		}
		// Entry utama (biasanya 2 akun: debit dan kredit)
		const baseEntries = mappings
			.filter((m) => m.usage === 'piutang' || m.usage === 'pendapatan') // atur sesuai base logic lo
			.map((m) => {
				return {
					accountCode: m.accountCode,
					debit: m.position === 'DEBIT' ? baseAmountDebit : null,
					credit: m.position === 'CREDIT' ? baseAmountCredit : null,
				};
			});

		// Entry tambahan seperti PPN, biaya admin, dll
		// const additionalEntries = additional
		// 	.map((add) => {
		// 		const map = mappings.find((m) => m.usage === add.usage && m.position === add.position);
		// 		if (!map) throw new Error(`Mapping tidak ditemukan untuk usage=${add.usage}, position=${add.position}`);
		// 		return {
		// 			accountCode: map.accountCode,
		// 			debit: add.position === 'DEBIT' ? add.amount : null,
		// 			credit: add.position === 'CREDIT' ? add.amount : null,
		// 		};
		// 	})
		// 	.filter(Boolean);

		// return [...baseEntries, ...additionalEntries];
	}

	// const journalEntries = await generateJournalEntriesFromMapping({
	//   module: 'SALES',
	//   transactionType: 'INVOICE',
	//   baseAmount: 10_000,
	//   additional: [
	//     { usage: 'ppn', position: 'CREDIT', amount: 1_000 },
	//     { usage: 'admin_fee', position: 'DEBIT', amount: 500 },
	//   ]
	// });

	// await prisma.journalEntry.create({
	//   data: {
	//     date: new Date(),
	//     module: 'SALES',
	//     description: 'Penjualan INVOICE 001',
	//     referenceId: invoice.id,
	//     items: {
	//       create: journalEntries,
	//     }
	//   }
	// });

	prepareAdditionalEntries(invoice: Invoice): AdditionalEntry[] {
		const additional: AdditionalEntry[] = [];

		if (invoice.tax > 0) {
			additional.push({ usage: 'ppn', position: 'CREDIT', amount: invoice.tax });
		}
		if (invoice.adminFee > 0) {
			additional.push({ usage: 'admin_fee', position: 'DEBIT', amount: invoice.adminFee });
		}

		return additional;
	}
	async generateJournalEntriesFromMappingV2(input: JournalInput) {
		const { module, transactionType, baseAmountDebit, baseAmountCredit, additional = [], unitId } = input;

		const mappings = await this.prisma.accountMapping.findMany({
			where: { module, transactionType, deletedAt: null },
		});

		if (!mappings.length) {
			throw new Error(`Mapping jurnal tidak ditemukan untuk module=${module}, transactionType=${transactionType}`);
		}

		const journalEntries = mappings.map((mapping) => {
			const additionalItem = additional.find((a) => a.usage === mapping.usage);
			const amount = !additionalItem
				? mapping.position === 'DEBIT'
					? baseAmountDebit
					: baseAmountCredit
				: additionalItem.amount;

			return {
				accountCode: mapping.accountCode,
				debit: mapping.position === 'DEBIT' ? amount : 0,
				credit: mapping.position === 'CREDIT' ? amount : 0,
				unitId,
				debitDollar: 0,
				creditDollar: 0,
			};
		});

		const sorted = journalEntries.sort((a, b) => {
			// Kalau debit > 0, letakkan di atas
			if (a.debit > 0 && b.debit === 0) return -1;
			if (a.debit === 0 && b.debit > 0) return 1;
			return 0;
		});
		return sorted;
	}

	async generateJournalEntriesFromMappingDollar(input: JournalInput) {
		const { module, transactionType, baseAmountDebit, baseAmountCredit, additional = [], unitId } = input;

		const mappings = await this.prisma.accountMapping.findMany({
			where: { module, transactionType, deletedAt: null },
		});

		if (!mappings.length) {
			throw new Error(`Mapping jurnal tidak ditemukan untuk module=${module}, transactionType=${transactionType}`);
		}

		const journalEntries = mappings.map((mapping) => {
			const additionalItem = additional.find((a) => a.usage === mapping.usage);
			const amount = !additionalItem
				? mapping.position === 'DEBIT'
					? baseAmountDebit
					: baseAmountCredit
				: additionalItem.amount;

			return {
				accountCode: mapping.accountCode,
				debitDollar: mapping.position === 'DEBIT' ? amount : 0,
				creditDollar: mapping.position === 'CREDIT' ? amount : 0,
				unitId,
			};
		});

		const sorted = journalEntries.sort((a, b) => {
			// Kalau debit > 0, letakkan di atas
			if (a.debitDollar > 0 && b.debitDollar === 0) return -1;
			if (a.debitDollar === 0 && b.debitDollar > 0) return 1;
			return 0;
		});
		return sorted;
	}

	async generateJournalEntriesFromMappingV3(input: JournalInput) {
		const { module, transactionType, baseAmountDebit, baseAmountCredit, additional = [] } = input;

		const mappings = await this.prisma.accountMapping.findMany({
			where: { module, transactionType, deletedAt: null },
		});

		if (!mappings.length) {
			throw new Error(`Mapping jurnal tidak ditemukan untuk module=${module}, transactionType=${transactionType}`);
		}

		const journalEntries = mappings
			.map((mapping) => {
				const additionalItem = additional.find((a) => a.usage === mapping.usage);
				const amount = additionalItem
					? additionalItem.amount
					: mapping.position === 'DEBIT'
						? baseAmountDebit
						: baseAmountCredit;

				return {
					accountCode: mapping.accountCode,
					debit: mapping.position === 'DEBIT' ? amount : 0,
					credit: mapping.position === 'CREDIT' ? amount : 0,
					unitId: input.unitId,
				};
			})
			// 🔥 Filter yang debit & credit sama-sama 0 atau null
			.filter((entry) => (entry.debit || 0) > 0 || (entry.credit || 0) > 0);

		return journalEntries;
	}

	async calculateTaxPayment(input: TaxInput): Promise<TaxCalculationResultTax> {
		const { amount, taxType, withholdingRate } = input;
		const grossAmount = amount;
		let taxWithheld = 0;
		const vatInput = 0;
		// 1. Handle PPN
		if (taxType === 'PPN 11%') {
			taxWithheld = -(((withholdingRate || 11) / 100) * grossAmount).toFixed(2);
		}

		// 2. Handle PPh Potongan
		if (taxType == 'PPh 22') {
			taxWithheld = +(withholdingRate * grossAmount).toFixed(2);
		}

		if (taxType == 'PPh 23') {
			taxWithheld = +(withholdingRate * grossAmount).toFixed(2);
		}

		if (taxType == 'PPh 21') {
			taxWithheld = +(withholdingRate * grossAmount).toFixed(2);
		}
		// 3. Net Paid = Gross - withholding
		const netPaid = +(grossAmount - taxWithheld).toFixed(2);

		return {
			grossAmount,
			netPaid,
			taxWithheld: Math.abs(taxWithheld) > 0 ? Math.abs(taxWithheld) : undefined,
			vatInput: vatInput > 0 ? vatInput : undefined,
		};
	}

	decodeJwt(req: Request) {
		const authHeader = req.headers['authorization'] || '';
		const token = authHeader.replace('Bearer ', '');
		const decoded: DecodeTokenType = jwtDecode(token);
		return decoded;
	}
}

export function convertToKebabCase(text: string) {
	// Mengubah huruf besar menjadi kecil dan memisahkan kata dengan strip "-"
	return text.trim().toLowerCase().replace(/\s+/g, '-');
}

/**
 * Mengembalikan objek Date yang merepresentasikan akhir hari (23:59:59.999)
 * dari input yang diberikan (bisa string atau Date).
 *
 * @param input - Tanggal dalam bentuk string atau Date
 * @returns Date - Akhir hari (end of day)
 */
export function toEndOfDay(input: string | Date): Date {
	return dayjs(input).endOf('day').toDate();
}
