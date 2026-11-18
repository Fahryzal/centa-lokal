import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '@src/modules/common/prisma.service';
import { toEndOfDay } from '@src/common/utils/helper/helper';

@Injectable({ scope: Scope.REQUEST })
export class ReportGeneratEdgerService {
	constructor(private readonly prisma: PrismaService) {}
	async getIncomeStatementFromLedger(period: string) {
		const ledgers = await this.prisma.generalLedger.findMany({
			where: {
				period,
				account: {
					accountType: {
						name: {
							in: ['REVENUE', 'EXPENSE'],
						},
					},
				},
			},
			include: {
				account: {
					include: {
						accountType: true,
					},
				},
			},
		});

		const grouped = ledgers.map((ledger) => ({
			name: ledger.account.name,
			type: ledger.account.accountType.name,
			normalBalance: ledger.account.accountType.normalBalance as 'DEBIT' | 'CREDIT',
			debit: ledger.debitTotal,
			credit: ledger.creditTotal,
		}));

		const revenues = grouped.filter((a) => a.type === 'REVENUE');
		const expenses = grouped.filter((a) => a.type === 'EXPENSE');

		const totalRevenue = revenues.reduce((sum, acc) => {
			const value =
				acc.normalBalance === 'CREDIT' ? Number(acc.credit) - Number(acc.debit) : Number(acc.debit) - Number(acc.credit);
			return sum + value;
		}, 0);

		const totalExpense = expenses.reduce((sum, acc) => {
			const value =
				acc.normalBalance === 'DEBIT' ? Number(acc.debit) - Number(acc.credit) : Number(acc.credit) - Number(acc.debit);
			return sum + value;
		}, 0);

		const netProfit = totalRevenue - totalExpense;

		return {
			revenues,
			expenses,
			totalRevenue,
			totalExpense,
			netProfit,
		};
	}

	async getTrialBalance(unitId: string, period: string) {
		const ledgers = await this.prisma.generalLedger.findMany({
			where: {
				period,
				unitId,
			},
			include: {
				account: true,
			},
			orderBy: {
				account: {
					code: 'asc',
				},
			},
		});

		return ledgers.map((ledger) => ({
			accountCode: ledger.account.code,
			accountName: ledger.account.name,
			// openingDebit: ledger.openingDebit,
			// openingCredit: ledger.openingCredit,
			mutationDebit: ledger.debitTotal,
			mutationCredit: ledger.creditTotal,
			// closingDebit: ledger.closingDebit,
			// closingCredit: ledger.closingCredit,
		}));
	}

	async getTrialBalanceGroupedByUnit(period: string) {
		const ledgers = await this.prisma.generalLedger.findMany({
			where: { period },
			include: {
				account: true,
				unit: true,
			},
			orderBy: {
				unit: {
					nama: 'asc', // atau code
				},
			},
		});

		const grouped = new Map<
			string,
			{
				unitName: string;
				ledgers: {
					accountCode: string;
					accountName: string;
					openingDebit: number;
					openingCredit: number;
					mutationDebit: number;
					mutationCredit: number;
					closingDebit: number;
					closingCredit: number;
				}[];
			}
		>();

		for (const ledger of ledgers) {
			const key = ledger.unitId;

			if (!grouped.has(key)) {
				grouped.set(key, {
					unitName: ledger.unit.nama, // misal nama unitnya
					ledgers: [],
				});
			}

			grouped.get(key)!.ledgers.push({
				accountCode: ledger.account.id,
				accountName: ledger.account.name,
				openingDebit: 0,
				openingCredit: 0,
				mutationDebit: Number(ledger.debitTotal),
				mutationCredit: Number(ledger.creditTotal),
				closingDebit: 0,
				closingCredit: 0,
			});
		}

		return [...grouped.values()];
	}

	async generateTrialBalance(unitId: string, period: string, fiscalYear: string) {
		const accounts = await this.prisma.account.findMany({
			orderBy: {
				code: 'asc',
			},
		});

		return Promise.all(accounts.map((acc) => this.buildTrialBalanceRow(acc, unitId, period, fiscalYear)));
	}

	private async buildTrialBalanceRow(account, unitId: string, period: string, fiscalYear: string) {
		const neracaAwal = await this.getOpeningBalance(account.code, unitId, fiscalYear);
		const prevPeriod = this.getPreviousPeriod(period);
		// const saldoAwal = prevPeriod ? await this.getGeneralLedger(account.id, unitId, prevPeriod) : { debit: 0, credit: 0 };
		const saldoAwal = await this.getGeneralLedger(account.code, unitId, prevPeriod);

		const mutasi = await this.getMutasiJurnal(account.code, unitId, period);
		// opening balance
		const saldoAkhir = {
			debit: neracaAwal.debit + mutasi.debit + saldoAwal.debit,
			credit: neracaAwal.credit + mutasi.credit + saldoAwal.credit,
		};

		//note:perbaikan perhitungan saldo akhir, saldo awal dan neraca awal, di bulan bulan selanjutnya harusnya neraca awal tidak di hitung
		return {
			accountCode: account.code,
			accountName: account.name,
			saldoAwal,
			neracaAwal,
			mutasi,
			saldoAkhir,
		};
	}

	private async getOpeningBalance(accountCode: string, unitId: string, fiscalYear: string) {
		const whereCondition: any = {
			fiscalYear,
			status: 'confirmed',
		};

		if (unitId !== 'null') {
			whereCondition.unitId = unitId;
		}

		const openingHeaders = await this.prisma.openingBalanceHeader.findMany({
			where: whereCondition,
			include: {
				details: {
					where: {
						accountCode,
					},
				},
			},
		});

		// Hitung total debit & credit dari semua header yang ditemukan
		const totalDebit = openingHeaders.reduce((sumHeader, header) => {
			const detailSum = header.details.reduce((sum, item) => sum + item.debit, 0);
			return sumHeader + detailSum;
		}, 0);

		const totalCredit = openingHeaders.reduce((sumHeader, header) => {
			const detailSum = header.details.reduce((sum, item) => sum + item.credit, 0);
			return sumHeader + detailSum;
		}, 0);

		return {
			debit: totalDebit,
			credit: totalCredit,
		};
	}

	/**
	 * Get general ledger for specific account and period.
	 * @param {string} accountCode account id.
	 * @param {string} unitId unit id.
	 * @param {string} period period in format 'YYYY-MM'.
	 * @returns {Promise<{ debit: number, credit: number >}> general ledger data.
	 */
	private async getGeneralLedger(accountCode: string, unitId: string, period: string) {
		const whereCondition: any = { accountCode, period };
		if (unitId !== 'null') {
			whereCondition.unitId = unitId;
		}
		const gl = await this.prisma.generalLedger.findMany({
			where: whereCondition,
		});
		return {
			debit: gl.reduce((sum, item) => Number(sum) + Number(item.debitTotal), 0) || 0,
			credit: gl.reduce((sum, item) => Number(sum) + Number(item.creditTotal), 0) || 0,
		};
	}

	private async getMutasiJurnal(accountCode: string, unitId: string, period: string) {
		const [year, month] = period.split('-').map(Number);
		const start = new Date(year, month - 1, 1);
		const end = new Date(year, month, 0, 23, 59, 59);

		const whereCondition: any = {
			accountCode,
			journalEntry: {
				isPosted: true,
				deletedAt: null,
				date: {
					gte: start,
					lte: end,
				},
			},
		};
		if (unitId !== 'null') {
			whereCondition.unitId = unitId;
		}

		const transaksi = await this.prisma.journalEntryDetail.findMany({
			where: whereCondition,
			select: { debit: true, credit: true },
		});

		return transaksi.reduce(
			(acc, cur) => {
				acc.debit += Number(cur.debit) || 0;
				acc.credit += Number(cur.credit) || 0;
				return acc;
			},
			{ debit: 0, credit: 0 }
		);
	}

	private getPreviousPeriod(period: string): string {
		const [year, month] = period.split('-').map(Number);
		const prev = new Date(year, month - 2); // minus 1 month
		return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
	}
	async getIncomeStatement(unitId: string, period: string) {
		const data = await this.prisma.generalLedger.findMany({
			where: {
				period,
				unitId,
				account: {
					accountType: {
						name: { in: ['REVENUE', 'EXPENSE'] },
					},
				},
			},
			include: {
				account: {
					include: {
						accountType: true,
					},
				},
			},
		});

		const result = data.reduce(
			(acc, item) => {
				const { name } = item.account.accountType;
				const net = Number(item.creditTotal) - Number(item.debitTotal);
				if (name === 'REVENUE') {
					acc.revenue += net;
				} else if (name === 'EXPENSE') {
					acc.expense += net;
				}
				return acc;
			},
			{ revenue: 0, expense: 0 }
		);

		return {
			totalPendapatan: result.revenue,
			totalBeban: result.expense,
			labaRugiBersih: result.revenue - result.expense,
		};
	}

	async getBalanceSheet(unitId: string, period: string) {
		const data = await this.prisma.generalLedger.findMany({
			where: {
				period,
				unitId,
				account: {
					accountType: {
						name: { in: ['ASSET', 'LIABILITY', 'EQUITY'] },
					},
				},
			},
			include: {
				account: {
					include: {
						accountType: true,
					},
				},
			},
		});

		const result = data.reduce(
			(acc, item) => {
				const { name } = item.account.accountType;
				const net = Number(item.debitTotal) - Number(item.creditTotal);
				if (name === 'ASSET') {
					acc.assets += net;
				} else if (name === 'LIABILITY') {
					acc.liabilities += -net; // Liabilitas biasanya kredit
				} else if (name === 'EQUITY') {
					acc.equity += -net; // Ekuitas juga
				}
				return acc;
			},
			{ assets: 0, liabilities: 0, equity: 0 }
		);

		return result;
	}

	async getChangesInEquity(unitId: string, period: string) {
		const equityData = await this.getBalanceSheet(unitId, period);
		const incomeStatement = await this.getIncomeStatement(unitId, period);

		return {
			equityAwal: equityData.equity - incomeStatement.labaRugiBersih,
			labaRugi: incomeStatement.labaRugiBersih,
			equityAkhir: equityData.equity,
		};
	}

	async getFinancialSummary(unitId: string, period: string) {
		const [income, balance, equity] = await Promise.all([
			this.getIncomeStatement(unitId, period),
			this.getBalanceSheet(unitId, period),
			this.getChangesInEquity(unitId, period),
		]);

		return {
			unitId,
			period,
			labaRugi: income,
			neraca: balance,
			perubahanModal: equity,
		};
	}

	async getConsolidatedReport(start: Date, end: Date) {
		const journalDetails = await this.prisma.journalEntryDetail.findMany({
			where: {
				journalEntry: {
					date: {
						gte: start,
						lte: toEndOfDay(end),
					},
				},
				isTmp: false, // ❗ Hanya ambil data real, bukan mirroring
			},
			include: {
				account: {
					include: {
						accountType: true,
					},
				},
			},
		});

		const groupedByAccountType: Record<string, { debit: number; credit: number }> = {};

		for (const entry of journalDetails) {
			const type = entry.account.accountType.name;
			if (!groupedByAccountType[type]) {
				groupedByAccountType[type] = { debit: 0, credit: 0 };
			}
			groupedByAccountType[type].debit += Number(entry.debit);
			groupedByAccountType[type].credit += Number(entry.credit);
		}

		const revenue = groupedByAccountType['REVENUE'] || { debit: 0, credit: 0 };
		const expense = groupedByAccountType['EXPENSE'] || { debit: 0, credit: 0 };
		const equity = groupedByAccountType['EQUITY'] || { debit: 0, credit: 0 };
		const asset = groupedByAccountType['ASSET'] || { debit: 0, credit: 0 };
		const liability = groupedByAccountType['LIABILITY'] || { debit: 0, credit: 0 };

		const labaBersih = revenue.credit - expense.debit;

		return {
			incomeStatement: {
				revenue: revenue.credit,
				expense: expense.debit,
				netIncome: labaBersih,
			},
			balanceSheet: {
				asset: asset.debit,
				liability: liability.credit,
				equity: equity.credit + labaBersih,
			},
			changesInEquity: {
				openingEquity: equity.credit,
				netIncome: labaBersih,
				closingEquity: equity.credit + labaBersih,
			},
			summary: {
				totalDebit: Object.values(groupedByAccountType).reduce((sum, val) => sum + val.debit, 0),
				totalCredit: Object.values(groupedByAccountType).reduce((sum, val) => sum + val.credit, 0),
			},
		};
	}
}
