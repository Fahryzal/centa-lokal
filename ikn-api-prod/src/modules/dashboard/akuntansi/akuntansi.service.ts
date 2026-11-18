import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import { BankBalanceFilterDto, ExpenseFilterDto, ExpenseRecord, NetProfitFilterDto } from './dto/get-akuntansi.dto';

const MONTH_MAP = {
	Jan: 1,
	Feb: 2,
	Mar: 3,
	Apr: 4,
	May: 5,
	Jun: 6,
	Jul: 7,
	Aug: 8,
	Sep: 9,
	Oct: 10,
	Nov: 11,
	Dec: 12,
};

function getAllChildren(account: any, list: any[] = []) {
	if (!account.children) return list;

	for (const child of account.children) {
		list.push(child);
		getAllChildren(child, list);
	}

	return list;
}

function sumJournalDetails(account: any, accountsMap: Map<string, any>) {
	const allChildren = getAllChildren(account);
	const allCodes = [account.code, ...allChildren.map((a) => a.code)];

	let totalDebit = 0;
	let totalCredit = 0;

	for (const code of allCodes) {
		const acc = accountsMap.get(code);
		if (!acc || !acc.journalDetails) continue;

		for (const detail of acc.journalDetails) {
			totalDebit += Number(detail.debit);
			totalCredit += Number(detail.credit);
		}
	}

	return { totalDebit, totalCredit };
}

@Injectable()
export class AkuntansiService {
	constructor(private prisma: PrismaService) {}

	async getDashboardSummary(period?: string) {
		const today = dayjs();

		const dateFilter: any = {};
		let year = today.format('YYYY');

		if (period) {
			// ====================
			// FORMAT DD/MM/YYYY-DD/MM/YYYY
			// ====================
			if (period.includes('-')) {
				const [startStr, endStr] = period.split('-').map((v) => v.trim());

				const startDate = dayjs(startStr, 'DD/MM/YYYY', true).startOf('day').toDate();

				const endDate = dayjs(endStr, 'DD/MM/YYYY', true).endOf('day').toDate();

				year = dayjs(startDate).format('YYYY');

				dateFilter.date = {
					gte: startDate,
					lte: endDate,
				};
			}

			// ====================
			// FORMAT MM/YYYY
			// ====================
			else if (period.includes('/')) {
				const [month, selectedYear] = period.split('/');

				year = selectedYear;

				const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();

				const endDate = dayjs(`${year}-${month}-01`).endOf('month').toDate();

				dateFilter.date = {
					gte: startDate,
					lte: endDate,
				};
			}

			// ====================
			// FORMAT YYYY
			// ====================
			else if (period.length === 4) {
				year = period;

				const startDate = dayjs(`${year}-01-01`).startOf('year').toDate();

				const endDate = dayjs(`${year}-12-31`).endOf('year').toDate();

				dateFilter.date = {
					gte: startDate,
					lte: endDate,
				};
			}
		} else {
			// default hari ini
			dateFilter.date = {
				gte: today.startOf('day').toDate(),
				lte: today.endOf('day').toDate(),
			};
		}

		const [cashIn, cashOut] = await this.prisma.$transaction([
			this.prisma.cashBankTransaction.aggregate({
				_sum: {
					amountOriginal: true,
				},
				where: {
					type: {
						in: ['CASH_IN', 'TRANSFER_IN', 'CHEQUE_IN', 'GIRO_IN', 'E_WALLET_IN', 'OTHER_IN'],
					},
					deletedAt: null,
					...dateFilter,
				},
			}),

			this.prisma.cashBankTransaction.aggregate({
				_sum: {
					amountOriginal: true,
				},
				where: {
					type: {
						in: ['CASH_OUT', 'TRANSFER_OUT', 'CHEQUE_OUT', 'GIRO_OUT', 'E_WALLET_OUT', 'OTHER_OUT'],
					},
					deletedAt: null,
					...dateFilter,
				},
			}),
		]);

		const bankBalances = await this.getBankBalances({ year });

		return {
			cashFlowToday: {
				in: cashIn._sum.amountOriginal || 0,
				out: cashOut._sum.amountOriginal || 0,
			},
			expenseSummary: [],
			bankBalances,
		};
	}

	// Nama bulan
	private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	/**
	 * Generate laporan Income vs Expenses per bulan
	 * untuk 1 tahun tertentu.
	 */
	async getMonthlyIncomeExpense(year: number, unitId?: string) {
		const ledgerData = await this.prisma.generalLedger.findMany({
			where: {
				period: {
					startsWith: `${year}-`, // "2025-"
				},
				...(unitId ? { unitId } : {}),
			},
			include: {
				account: {
					include: {
						accountType: true,
					},
				},
			},
		});

		return this.transformLedgerToRawData(ledgerData, year);
	}

	/**
	 * Convert ledger Prisma menjadi rawData format
	 */
	private transformLedgerToRawData(ledgers: any[], year: number) {
		const result = {};

		for (const item of ledgers) {
			const [y, m] = item.period.split('-');
			if (Number(y) !== year) continue;

			const monthIndex = Number(m) - 1;
			const monthName = this.monthNames[monthIndex];

			if (!result[monthName]) {
				result[monthName] = {
					month: monthName,
					Income: 0,
					Expenses: 0,
					year,
				};
			}

			const typeCode = item.account.accountType.code; // 'R', 'E'
			const balance = Number(item.debitTotal) - Number(item.creditTotal);

			// INCOME (Pendapatan)
			if (typeCode === 'R') {
				result[monthName].Income += Math.abs(balance);
			}

			// EXPENSES (Beban)
			if (typeCode === 'X') {
				result[monthName].Expenses += Math.abs(balance);
			}
		}

		return Object.values(result);
	}

	async getCashFlow({ year, month, unitId }: { year?: string; month?: string; unitId?: string }) {
		const where: any = {};

		if (unitId) where.unitId = unitId;
		if (year || month) {
			where.date = {};

			if (year) {
				where.date.gte = new Date(`${year}-01-01`);
				where.date.lte = new Date(`${year}-12-31`);
			}

			if (month) {
				const m = month.padStart(2, '0');
				where.date.gte = new Date(`${year}-${m}-01`);
				where.date.lte = new Date(`${year}-${m}-31`);
			}
		}

		const transactions = await this.prisma.cashBankTransaction.findMany({
			where,
			select: {
				amountInIDR: true,
				type: true,
				date: true,
			},
			orderBy: { date: 'asc' },
		});

		// Grouping month-year
		const grouped = {};

		for (const trx of transactions) {
			const m = dayjs(trx.date).format('MMM');
			const y = dayjs(trx.date).format('YYYY');
			const key = `${m}-${y}`;

			if (!grouped[key]) {
				grouped[key] = {
					month: m,
					year: y,
					cashIn: 0,
					cashOut: 0,
				};
			}

			if (trx.type === TransactionType.CASH_IN) {
				grouped[key].cashIn += Number(trx.amountInIDR);
			} else if (trx.type === TransactionType.CASH_OUT) {
				grouped[key].cashOut += Number(trx.amountInIDR);
			}
		}

		// Return as array
		return Object.values(grouped);
	}

	async getNetProfit(filter: NetProfitFilterDto) {
		const { year, typeTransaction, unitId } = filter;
		const transactions = await this.prisma.cashBankTransaction.findMany({
			where: {
				deletedAt: null,
				//Hanya tampilkan jika salah satu TIDAK null
				NOT: {
					invoiceId: null,
					invoiceEksporId: null,
				},
				...(year && {
					date: {
						gte: new Date(`${year}-01-01`),
						lt: new Date(`${Number(year) + 1}-01-01`),
					},
				}),
				...(typeTransaction && { typeTransaction }),
				...(unitId && { unitId }),
			},
			select: {
				amountInIDR: true,
				date: true,
				typeTransaction: true,
				exchangeRate: true,
			},
			orderBy: { date: 'asc' },
		});

		// Grup per bulan & product
		const grouped = {};

		transactions.forEach((t) => {
			const m = t.date.getMonth() + 1; // 1-12
			const monthName = Object.keys(MONTH_MAP).find((key) => MONTH_MAP[key] === m);

			const y = t.date.getFullYear();
			const product = t.typeTransaction ?? 'UNKNOWN';

			const key = `${monthName}-${y}-${product}`;

			if (!grouped[key]) {
				grouped[key] = {
					month: monthName,
					year: `${y}`,
					product,
					netProfit: 0,
				};
			}

			grouped[key].netProfit += Number(t.amountInIDR);
		});

		// Convert to array
		return Object.values(grouped).sort((a: any, b: any) => {
			if (a.year !== b.year) return Number(a.year) - Number(b.year);
			return MONTH_MAP[a.month] - MONTH_MAP[b.month];
		});
	}

	async getBankBalances(filter: BankBalanceFilterDto) {
		const { year, month, unitId } = filter;

		const where: any = {
			deletedAt: null,
			...(unitId && { unitId }),
		};

		// Filter year
		if (year) {
			where.date = {
				gte: new Date(`${year}-01-01`),
				lt: new Date(`${Number(year) + 1}-01-01`),
			};
		}

		// Filter month
		if (year && month) {
			where.date = {
				gte: new Date(`${year}-${month}-01`),
				lt: new Date(`${year}-${Number(month) + 1}-01`),
			};
		}

		const records = await this.prisma.bankAccount.findMany({
			where,
			select: {
				bankName: true,
				bankCode: true,
				accountCode: true,
				currentBalance: true,
				currentBalanceDollar: true,
				initialBalance: true,
				date: true,
			},
			orderBy: { date: 'asc' },
		});

		// const result = records.map((r) => ({
		// 	bankName: r.bankName,
		// 	balance: new Decimal(r.currentBalance).plus(r.initialBalance).toNumber(),
		// 	month: String(r.date.getMonth() + 1).padStart(2, '0'),
		// 	year: String(r.date.getFullYear()),
		// }));

		const result = Object.values(
			records.reduce(
				(acc, r) => {
					const key = r.accountCode;

					if (!acc[key]) {
						acc[key] = {
							accountCode: r.accountCode,
							bankCode: r.bankCode,
							bankName: r.bankName,
							isDollar: String(r?.bankCode ?? '')
								.trim()
								.toUpperCase()
								.endsWith('V'),
							balance: new Decimal(r.currentBalance).plus(r.initialBalance).toNumber(),
							balanceDollar: r?.currentBalanceDollar ?? 0,
							month: String(r.date.getMonth() + 1).padStart(2, '0'),
							year: String(r.date.getFullYear()),
						};
					} else {
						acc[key].balance += new Decimal(r.currentBalance).plus(r.initialBalance).toNumber();
					}

					return acc;
				},
				{} as Record<
					string,
					{
						accountCode: string;
						bankCode: string;
						isDollar: boolean;
						bankName: string;
						balance: number;
						balanceDollar?: number;
						month: string;
						year: string;
					}
				>,
			),
		);

		return result;
	}

	async getSummary() {
		const accounts = await this.prisma.account.findMany({
			where: {
				deletedAt: null,
				accountType: {
					name: 'EXPENSE',
				},
			},
			include: {
				children: {
					include: {
						children: true,
					},
				},
				journalDetails: true,
			},
		});

		// Biar gampang akses by code
		const accountsMap = new Map(accounts.map((acc) => [acc.code, acc]));

		const result = [];

		for (const account of accounts) {
			const { totalDebit, totalCredit } = sumJournalDetails(account, accountsMap);

			result.push({
				code: account.code,
				name: account.name,
				totalDebit,
				totalCredit,
			});
		}

		return result;
	}

	async getExpenseSummary(filter: ExpenseFilterDto): Promise<ExpenseRecord[]> {
		const { year, unitId } = filter;
		if (!year) throw new BadRequestException('Year is required');

		const accounts = await this.prisma.account.findMany({
			where: {
				deletedAt: null,
				accountType: {
					name: { in: ['EXPENSE', 'BEBAN', 'BIAYA'] },
				},
			},
			include: { accountType: true },
			orderBy: { code: 'asc' },
		});

		const accountByCode = new Map<string, any>();
		const accountById = new Map<string, any>(); // ← tambah lookup by ID

		for (const acc of accounts) {
			accountByCode.set(acc.code, acc);
			accountById.set(acc.id, acc); // ← index by ID
		}

		// Build childrenMap: parentCode -> childCodes[]
		// parentId adalah UUID/ID, resolve ke code dulu
		const childrenMap = new Map<string, string[]>();
		for (const acc of accounts) {
			if (!acc.parentId) continue;

			const parent = accountById.get(acc.parentId); // ← resolve ID → account
			if (!parent) continue;

			const list = childrenMap.get(parent.code) ?? [];
			list.push(acc.code);
			childrenMap.set(parent.code, list);
		}

		// Ledger aggregation
		const whereLedger: any = {
			period: { startsWith: year },
			deletedAt: null,
		};
		if (unitId) whereLedger.unitId = unitId;

		const ledgerAggregates = await this.prisma.generalLedger.groupBy({
			by: ['accountCode'],
			where: whereLedger,
			_sum: { debitTotal: true, creditTotal: true },
		});

		const ledgerMap = new Map<string, number>();
		for (const agg of ledgerAggregates) {
			const debit = Number(agg._sum.debitTotal ?? 0);
			const credit = Number(agg._sum.creditTotal ?? 0);
			ledgerMap.set(agg.accountCode, debit - credit);
		}

		// Recursive total dengan cycle detection
		const totalCache = new Map<string, number>();
		const getRecursiveTotal = (code: string, visiting = new Set<string>()): number => {
			if (totalCache.has(code)) return totalCache.get(code)!;

			// Cycle detected → kembalikan 0 untuk branch ini
			if (visiting.has(code)) {
				console.warn(`Circular reference detected at account code: ${code}`);
				return 0;
			}

			visiting.add(code);

			let total = ledgerMap.get(code) ?? 0;
			const children = childrenMap.get(code) ?? [];
			for (const childCode of children) {
				total += getRecursiveTotal(childCode, visiting);
			}

			visiting.delete(code);
			totalCache.set(code, total);
			return total;
		};

		// Tentukan root accounts (tidak punya parent, atau parentnya bukan expense)
		const isExpenseType = (acc: any) => {
			const t = acc.accountType?.name?.toUpperCase() ?? '';
			return t === 'EXPENSE' || t === 'BEBAN' || t === 'BIAYA';
		};

		const result: ExpenseRecord[] = [];
		const processed = new Set<string>();

		for (const acc of accounts) {
			if (processed.has(acc.code)) continue;

			const parentAcc = acc.parentId ? accountById.get(acc.parentId) : null;
			const isRoot = !parentAcc || !isExpenseType(parentAcc);

			if (isExpenseType(acc) && isRoot) {
				processed.add(acc.code);
				const total = getRecursiveTotal(acc.code);

				result.push({
					accountCode: acc.code,
					category: acc.name,
					parentId: acc.parentId,
					value: Math.abs(total),
					year,
				});
			}
		}

		result.sort((a, b) => b.value - a.value);

		const top5 = result.slice(0, 5);
		const others = result.slice(5);

		if (others.length > 0) {
			const othersTotal = others.reduce((sum, item) => sum + item.value, 0);
			top5.push({
				accountCode: 'OTHERS',
				category: 'Lainnya',
				parentId: null,
				value: othersTotal,
				year,
			});
		}

		return top5;
	}
}
