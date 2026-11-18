import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { GetBankAccountDto } from './dto/get-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable({ scope: Scope.REQUEST })
export class BankAccountService {
	constructor(private readonly prisma: PrismaService) {}

	private getPeriod(date: string): string {
		const d = new Date(date);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
	}
	async create(createBankAccountDto: CreateBankAccountDto, decoded: DecodeTokenType) {
		const dateRes = new Date(createBankAccountDto.date);
		const fiscalYear = dayjs(createBankAccountDto.date).year();

		const period = this.getPeriod(dateRes.toISOString());

		return this.prisma.$transaction(async (tx) => {
			await tx.bankAccount.create({
				data: {
					bankAccountNumber: createBankAccountDto.bankAccountNumber,
					bankName: createBankAccountDto.bankName,
					bankCode: createBankAccountDto.bankCode,
					branchAddress: createBankAccountDto.branchAddress,
					currency: '',
					accountCode: createBankAccountDto.accountCode,
					initialBalance: createBankAccountDto.initialBalance,
					staffId: decoded.id,
					unitId: createBankAccountDto.unitId,
					date: createBankAccountDto.date,
					period: period,
					isPosted: 'N',
					OpeningBankDetails: {
						create: createBankAccountDto.details.map((items) => ({
							debit: items.debit,
							accountCode: items.accountCode,
							credit: items.credit,
							fiscalYear: String(fiscalYear),
							unitId: createBankAccountDto.unitId,
							staffId: decoded.id,
						})), // Filter untuk mengabaikan entry kosong
					},
				},
			});
		});
	}

	async findAll(query: GetBankAccountDto) {
		const { limit = 10, page = 1, code, bankAccountNumber, accountCode, bankName, bankCode, branchAddress, currency } = query;
		const skip = (page - 1) * limit;
		const take = +limit;
		const whereCondition: any = {};
		if (branchAddress) {
			whereCondition.branchAddress = {
				contains: branchAddress,
				mode: 'insensitive',
			};
		}

		if (currency) {
			whereCondition.currency = currency;
		}

		if (bankName) {
			whereCondition.bankName = {
				contains: bankName,
				mode: 'insensitive',
			};
		}
		if (bankCode) {
			whereCondition.bankCode = {
				contains: bankCode,
				mode: 'insensitive',
			};
		}
		if (accountCode) {
			whereCondition.accountCode = {
				contains: accountCode,
				mode: 'insensitive',
			};
		}
		if (code) {
			whereCondition.account = {
				code: code,
			};
		}

		if (bankAccountNumber) {
			whereCondition.bankAccountNumber = {
				contains: bankAccountNumber,
				mode: 'insensitive',
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.bankAccount.findMany({
				include: {
					account: true,
					unit: true,
				},
				skip,
				take,
				where: whereCondition,
			}),
			this.prisma.bankAccount.count({ where: whereCondition }),
		]);

		return {
			data,
			page: +page,
			limit: +limit,
			totalData,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	async generateTransactionNumber(bankAccountId: string, tanggal: Date): Promise<any> {
		const bankAccount = await this.prisma.bankAccount.findUnique({
			where: { id: bankAccountId },
		});

		if (!bankAccount) {
			throw new Error('Bank account tidak ditemukan');
		}

		const year = new Date(tanggal).getFullYear();
		const month = new Date(tanggal).getMonth() + 1;
		const bulanRomawiKamus = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
		const bulanRomawi = bulanRomawiKamus[month - 1];

		const startOfMonth = new Date(year, month - 1, 1);
		const endOfMonth = new Date(year, month, 1);

		const count = await this.prisma.cashBankTransaction.count({
			where: {
				bank_account_id: bankAccountId,
				// type: 'CASH_IN',
				date: {
					gte: startOfMonth,
					lt: endOfMonth,
				},
			},
		});

		const nomorUrut = (count + 1).toString().padStart(2, '0');
		return {
			data: `${bankAccount.bankCode}${nomorUrut}/${bulanRomawi}/${year}`,
		};
	}

	async generateTransactionNumberPembayaran(tanggal: Date): Promise<any> {
		const year = new Date(tanggal).getFullYear();
		const month = new Date(tanggal).getMonth() + 1;
		const bulanRomawiKamus = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
		const bulanRomawi = bulanRomawiKamus[month - 1];
		const startOfMonth = new Date(year, month - 1, 1);
		const endOfMonth = new Date(year, month, 1);

		const count = await this.prisma.cashBankTransaction.count({
			where: {
				type: 'CASH_OUT',
				date: {
					gte: startOfMonth,
					lt: endOfMonth,
				},
			},
		});

		const nomorUrut = (count + 1).toString().padStart(2, '0');
		return {
			data: `PB.${nomorUrut}.${bulanRomawi}.${year}`,
		};
	}

	findOne(id: string) {
		return this.prisma.bankAccount.findUnique({
			include: {
				unit: true,
				OpeningBankDetails: {
					include: {
						account: true,
					},
				},
			},
			where: {
				id,
			},
		});
	}

	async update(id: string, updateBankAccountDto: UpdateBankAccountDto, decoded: DecodeTokenType) {
		const fiscalYear = dayjs(updateBankAccountDto.date).year();

		return this.prisma.$transaction(async (tx) => {
			await tx.openingBankDetails.deleteMany({
				where: { headerId: id },
			});

			await tx.bankAccount.update({
				where: {
					id,
				},
				data: {
					bankAccountNumber: updateBankAccountDto.bankAccountNumber,
					bankName: updateBankAccountDto.bankName,
					bankCode: updateBankAccountDto.bankCode,
					branchAddress: updateBankAccountDto.branchAddress,
					accountCode: updateBankAccountDto.accountCode,
					initialBalance: updateBankAccountDto.initialBalance,
					staffId: decoded.id,
					unitId: updateBankAccountDto.unitId,
					date: updateBankAccountDto.date,
					OpeningBankDetails: {
						create: updateBankAccountDto.details.map((items) => ({
							debit: items.debit,
							accountCode: items.accountCode,
							credit: items.credit,
							fiscalYear: String(fiscalYear),
							unitId: updateBankAccountDto.unitId,
							staffId: decoded.id,
						})), // Filter untuk mengabaikan entry kosong
					},
				},
			});
		});
	}

	remove(id: string) {
		return this.prisma.$transaction(async (tx) => {
			await tx.openingBankDetails.deleteMany({
				where: { headerId: id },
			});

			await tx.bankAccount.delete({
				where: { id },
			});
		});
	}

	async postOpeningBalanceRevert(id: string) {
		return this.prisma.$transaction(async (tx) => {
			const dataBank = await tx.bankAccount.findUnique({
				where: { id },
				include: { OpeningBankDetails: true },
			});
			if (!dataBank) throw new NotFoundException('Opening not found');
			const period = this.getPeriod(dataBank.date.toISOString());
			for (const item of dataBank.OpeningBankDetails) {
				const { accountCode, debit: debitRection, credit: creditDirection, unitId } = item;
				const debit = debitRection || 0;
				const credit = creditDirection || 0;
				await tx.generalLedger.update({
					where: {
						unit_accountCode_periode: {
							accountCode: accountCode,
							period,
							unitId: unitId,
						},
					},
					data: {
						openingDebit: { decrement: Number(debit) },
						openingCredit: { decrement: Number(credit) },
					},
				});
			}

			await tx.bankAccount.update({
				where: {
					id: id,
				},
				data: {
					isPosted: 'N',
				},
			});

			return { message: 'Opening balance revert successfully' };
		});
	}

	async postOpeningBalance(id: string, decoded: DecodeTokenType) {
		const dataBank = await this.prisma.bankAccount.findUnique({
			where: { id },
			include: { OpeningBankDetails: true },
		});
		if (!dataBank) throw new NotFoundException('Journal not found');

		const period = this.getPeriod(dataBank.date.toISOString());

		for (const item of dataBank.OpeningBankDetails) {
			const { accountCode, debit: debitRection, credit: creditDirection } = item;
			const existingLedger = await this.prisma.generalLedger.findUnique({
				where: {
					unit_accountCode_periode: {
						accountCode,
						period,
						unitId: dataBank.unitId,
					},
				},
			});
			const debit = debitRection || 0;
			const credit = creditDirection || 0;

			if (!existingLedger) {
				await this.prisma.generalLedger.create({
					data: {
						accountCode,
						period,
						openingCredit: credit,
						openingDebit: debit,
						debitTotal: 0,
						creditTotal: 0,
						staffId: decoded.id,
						unitId: dataBank.unitId,
					},
				});
			} else {
				await this.prisma.generalLedger.update({
					where: {
						unit_accountCode_periode: {
							accountCode,
							period,
							unitId: dataBank.unitId,
						},
					},
					data: {
						openingDebit: { increment: debit },
						openingCredit: { increment: credit },
					},
				});
			}
		}

		// Mark journal as posted
		await this.prisma.bankAccount.update({
			where: { id },
			data: { isPosted: 'Y' },
		});

		return { message: 'Journal posted successfully', id };
	}
}
