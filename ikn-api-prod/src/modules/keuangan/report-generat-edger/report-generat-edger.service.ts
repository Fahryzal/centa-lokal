import { Injectable, Scope } from '@nestjs/common';
import { toEndOfDay } from '@src/common/utils/helper/helper';
import { PrismaService } from '@src/modules/common/prisma.service';
import Decimal from 'decimal.js';

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
			debit: new Decimal(ledger.debitTotal ?? 0),
			credit: new Decimal(ledger.creditTotal ?? 0),
		}));

		const revenues = grouped.filter((a) => a.type === 'REVENUE');
		const expenses = grouped.filter((a) => a.type === 'EXPENSE');

		const totalRevenue = revenues.reduce((sum, acc) => {
			const value = acc.normalBalance === 'CREDIT' ? acc.credit.minus(acc.debit) : acc.debit.minus(acc.credit);
			return sum.plus(value);
		}, new Decimal(0));

		const totalExpense = expenses.reduce((sum, acc) => {
			const value = acc.normalBalance === 'DEBIT' ? acc.debit.minus(acc.credit) : acc.credit.minus(acc.debit);
			return sum.plus(value);
		}, new Decimal(0));

		const netProfit = totalRevenue.minus(totalExpense);

		return {
			revenues: revenues.map((r) => ({
				...r,
				debit: r.debit.toNumber(),
				credit: r.credit.toNumber(),
			})),
			expenses: expenses.map((e) => ({
				...e,
				debit: e.debit.toNumber(),
				credit: e.credit.toNumber(),
			})),
			totalRevenue: totalRevenue.toNumber(),
			totalExpense: totalExpense.toNumber(),
			netProfit: netProfit.toNumber(),
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
					nama: 'asc',
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

			// pastikan angka aman dari null
			const openingDebit = new Decimal(ledger.openingDebit ?? 0);
			const openingCredit = new Decimal(ledger.openingCredit ?? 0);
			const mutationDebit = new Decimal(ledger.debitTotal ?? 0);
			const mutationCredit = new Decimal(ledger.creditTotal ?? 0);

			// hitung saldo awal & akhir akurat
			const saldoAwal = openingDebit.minus(openingCredit);
			const saldoAkhir = saldoAwal.plus(mutationDebit.minus(mutationCredit));

			// konversi ke debit/credit positif
			const opening = saldoAwal.greaterThanOrEqualTo(0)
				? { debit: saldoAwal, credit: new Decimal(0) }
				: { debit: new Decimal(0), credit: saldoAwal.abs() };

			const closing = saldoAkhir.greaterThanOrEqualTo(0)
				? { debit: saldoAkhir, credit: new Decimal(0) }
				: { debit: new Decimal(0), credit: saldoAkhir.abs() };

			if (!grouped.has(key)) {
				grouped.set(key, {
					unitName: ledger.unit.nama,
					ledgers: [],
				});
			}

			grouped.get(key)!.ledgers.push({
				accountCode: ledger.account.code,
				accountName: ledger.account.name,
				openingDebit: opening.debit.toNumber(),
				openingCredit: opening.credit.toNumber(),
				mutationDebit: mutationDebit.toNumber(),
				mutationCredit: mutationCredit.toNumber(),
				closingDebit: closing.debit.toNumber(),
				closingCredit: closing.credit.toNumber(),
			});
		}

		return [...grouped.values()];
	}

	async generateTrialBalance(unitId: string[] | string, period: string, _fiscalYear: string) {
		const [year, month] = period.split('-').map(Number);
		const prevPeriod = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, '0')}`;
		const whereCondition: any = {
			period,
			NOT: {
				debitTotal: 0,
				creditTotal: 0,
				openingDebit: 0,
				openingCredit: 0,
			},
		};
		if (unitId && unitId !== 'null') {
			if (Array.isArray(unitId)) {
				// kalau ada banyak unitId → gunakan operator "in"
				whereCondition.unitId = { in: unitId };
			} else {
				// kalau hanya satu unitId → langsung assign
				whereCondition.unitId = unitId;
			}
		}

		const whereConditionPrev: any = {
			period: prevPeriod,
			NOT: {
				debitTotal: 0,
				creditTotal: 0,
				openingDebit: 0,
				openingCredit: 0,
			},
		};

		if (unitId !== 'null') {
			if (Array.isArray(unitId)) {
				// kalau ada banyak unitId → gunakan operator "in"
				whereConditionPrev.unitId = { in: unitId };
			} else {
				// kalau hanya satu unitId → langsung assign
				whereConditionPrev.unitId = unitId;
			}
		}
		const [ledgers, prevLedgers] = await Promise.all([
			this.prisma.generalLedger.findMany({
				where: whereCondition,
				orderBy: {
					accountCode: 'asc',
				},
				select: {
					accountCode: true,
					account: { select: { name: true } },
					openingDebit: true,
					openingCredit: true,
					debitTotal: true,
					creditTotal: true,
				},
			}),
			this.prisma.generalLedger.findMany({
				where: whereConditionPrev,
				select: {
					accountCode: true,
					openingDebit: true,
					openingCredit: true,
					debitTotal: true,
					creditTotal: true,
				},
			}),
		]);

		if (!ledgers || ledgers.length === 0) return [];

		const mergedMap = new Map<string, any>();

		ledgers.forEach((ledger) => {
			const prev = prevLedgers.find((p) => p.accountCode === ledger.accountCode);

			const openingDebit = new Decimal(ledger.openingDebit || 0);
			const openingCredit = new Decimal(ledger.openingCredit || 0);
			const debitTotal = new Decimal(ledger.debitTotal || 0);
			const creditTotal = new Decimal(ledger.creditTotal || 0);

			const prevOpeningDebit = new Decimal(prev?.openingDebit || 0);
			const prevOpeningCredit = new Decimal(prev?.openingCredit || 0);
			const prevDebit = new Decimal(prev?.debitTotal || 0);
			const prevCredit = new Decimal(prev?.creditTotal || 0);

			const prevSaldoAkhirValue = prevOpeningDebit.minus(prevOpeningCredit).plus(prevDebit.minus(prevCredit));

			const saldoAwal = prevSaldoAkhirValue.gte(0)
				? { debit: prevSaldoAkhirValue, credit: new Decimal(0) }
				: { debit: new Decimal(0), credit: prevSaldoAkhirValue.abs() };

			const saldoAkhirValue = saldoAwal.debit
				.minus(saldoAwal.credit)
				.plus(debitTotal.minus(creditTotal).plus(openingDebit).minus(openingCredit));

			const saldoAkhir = saldoAkhirValue.gte(0)
				? { debit: saldoAkhirValue, credit: new Decimal(0) }
				: { debit: new Decimal(0), credit: saldoAkhirValue.abs() };

			if (!mergedMap.has(ledger.accountCode)) {
				mergedMap.set(ledger.accountCode, {
					accountCode: ledger.accountCode,
					accountName: ledger.account.name,
					saldoAwal,
					neracaAwal: { debit: openingDebit, credit: openingCredit },
					mutasi: { debit: debitTotal, credit: creditTotal },
					saldoAkhir,
				});
			} else {
				const existing = mergedMap.get(ledger.accountCode);
				// jumlahkan saldo awal, neraca, mutasi, saldo akhir
				existing.saldoAwal.debit = existing.saldoAwal.debit.plus(saldoAwal.debit);
				existing.saldoAwal.credit = existing.saldoAwal.credit.plus(saldoAwal.credit);

				existing.neracaAwal.debit = existing.neracaAwal.debit.plus(openingDebit);
				existing.neracaAwal.credit = existing.neracaAwal.credit.plus(openingCredit);

				existing.mutasi.debit = existing.mutasi.debit.plus(debitTotal);
				existing.mutasi.credit = existing.mutasi.credit.plus(creditTotal);

				existing.saldoAkhir.debit = existing.saldoAkhir.debit.plus(saldoAkhir.debit);
				existing.saldoAkhir.credit = existing.saldoAkhir.credit.plus(saldoAkhir.credit);
			}
		});

		// Konversi semua Decimal ke Number untuk output
		const result = [...mergedMap.values()].map((item) => ({
			accountCode: item.accountCode,
			accountName: item.accountName,
			saldoAwal: {
				debit: item.saldoAwal.debit.toNumber(),
				credit: item.saldoAwal.credit.toNumber(),
			},
			neracaAwal: {
				debit: item.neracaAwal.debit.toNumber(),
				credit: item.neracaAwal.credit.toNumber(),
			},
			mutasi: {
				debit: item.mutasi.debit.toNumber(),
				credit: item.mutasi.credit.toNumber(),
			},
			saldoAkhir: {
				debit: item.saldoAkhir.debit.toNumber(),
				credit: item.saldoAkhir.credit.toNumber(),
			},
		}));

		return result;
	}

	async generateTrialBalanceV2(unitId: string[] | string, period: string) {
		const [year, month] = period.split('-').map(Number);

		// 1. Generate semua periode dari Januari sampai periode yang diminta
		const periods: string[] = [];
		for (let m = 1; m <= month; m++) {
			periods.push(`${year}-${String(m).padStart(2, '0')}`);
		}

		// 2. Build where condition dinamis untuk unit
		const unitWhere: any = {
			NOT: {
				debitTotal: 0,
				creditTotal: 0,
				openingDebit: 0,
				openingCredit: 0,
			},
		};
		if (unitId && unitId !== 'null') {
			unitWhere.unitId = Array.isArray(unitId) ? { in: unitId } : unitId;
		}

		// if (!unitId || unitId === 'null') {
		// 	unitWhere.accountCode = {
		// 		not: {
		// 			contains: '080',
		// 		},
		// 	};
		// }

		// 3. Query semua ledger untuk semua periode tersebut
		const allLedgers = await this.prisma.generalLedger.findMany({
			where: {
				...unitWhere,
				period: { in: periods },
			},
			orderBy: {
				accountCode: 'asc',
			},
			select: {
				period: true,
				accountCode: true,
				account: { select: { name: true } },
				openingDebit: true,
				openingCredit: true,
				debitTotal: true,
				creditTotal: true,
			},
		});

		if (!allLedgers || allLedgers.length === 0) return [];

		// 4. Group by accountCode
		const grouped = new Map<
			string,
			{
				accountName: string;
				periods: Map<string, any>;
			}
		>();

		allLedgers.forEach((row) => {
			if (!grouped.has(row.accountCode)) {
				grouped.set(row.accountCode, {
					accountName: row.account.name,
					periods: new Map(),
				});
			}

			const acc = grouped.get(row.accountCode)!;
			const existing = acc.periods.get(row.period);

			if (existing) {
				// jika periode sudah ada → SUM
				acc.periods.set(row.period, {
					openingDebit: existing.openingDebit.plus(row.openingDebit || 0),
					openingCredit: existing.openingCredit.plus(row.openingCredit || 0),
					debitTotal: existing.debitTotal.plus(row.debitTotal || 0),
					creditTotal: existing.creditTotal.plus(row.creditTotal || 0),
				});
			} else {
				// jika belum ada → set baru
				acc.periods.set(row.period, {
					openingDebit: new Decimal(row.openingDebit || 0),
					openingCredit: new Decimal(row.openingCredit || 0),
					debitTotal: new Decimal(row.debitTotal || 0),
					creditTotal: new Decimal(row.creditTotal || 0),
				});
			}
		});

		// 5. Hitung saldo berantai untuk setiap akun
		const result: any[] = [];
		grouped.forEach((acc, accountCode) => {
			const accountName = acc.accountName;

			// Opening balance hanya dari bulan Januari
			const openingD = acc.periods.get(`${year}-01`)?.openingDebit || new Decimal(0);
			const openingC = acc.periods.get(`${year}-01`)?.openingCredit || new Decimal(0);

			let totalMutasiDebit = new Decimal(0);
			let totalMutasiCredit = new Decimal(0);

			let saldoAwal = new Decimal(0);
			let saldoAkhir = new Decimal(0);

			periods.forEach((p, index) => {
				const ledger = acc.periods.get(p);

				const mutasiD = ledger?.debitTotal || new Decimal(0);
				const mutasiC = ledger?.creditTotal || new Decimal(0);

				if (index === 0) {
					// Januari => saldoAwal = 0
					saldoAwal = new Decimal(0);
				} else {
					// saldo awal = total mutasi sampai bulan sebelumnya
					saldoAwal = totalMutasiDebit.minus(totalMutasiCredit);
				}

				// Tambah mutasi bulan ini ke total
				totalMutasiDebit = totalMutasiDebit.plus(mutasiD);
				totalMutasiCredit = totalMutasiCredit.plus(mutasiC);

				// Saldo akhir selalu:
				// (opening) + (akumulasi mutasi)
				saldoAkhir = openingD.minus(openingC).plus(totalMutasiDebit.minus(totalMutasiCredit));
			});

			result.push({
				accountCode,
				accountName,

				saldoAwal: saldoAwal.gte(0)
					? { debit: saldoAwal.toNumber(), credit: 0 }
					: { debit: 0, credit: saldoAwal.abs().toNumber() },

				mutasi: {
					debit: acc.periods.get(period)?.debitTotal?.toNumber() || 0,
					credit: acc.periods.get(period)?.creditTotal?.toNumber() || 0,
				},

				neracaAwal: {
					debit: openingD.toNumber(),
					credit: openingC.toNumber(),
				},

				saldoAkhir: saldoAkhir.gte(0)
					? { debit: saldoAkhir.toNumber(), credit: 0 }
					: { debit: 0, credit: saldoAkhir.abs().toNumber() },
			});
		});

		return result;
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
			{ revenue: 0, expense: 0 },
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
			{ assets: 0, liabilities: 0, equity: 0 },
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

	async maxPeriode(unitId: string[] | string) {
		// 2. Build where condition dinamis untuk unit
		const unitWhere: any = {
			NOT: {
				debitTotal: 0,
				creditTotal: 0,
				openingDebit: 0,
				openingCredit: 0,
			},
		};
		if (unitId && unitId !== 'null') {
			unitWhere.unitId = Array.isArray(unitId) ? { in: unitId } : unitId;
		}

		const lastPeriod = await this.prisma.generalLedger.findFirst({
			where: {
				...unitWhere,
			},
			orderBy: { period: 'desc' },
			select: { period: true },
		});

		return lastPeriod;
	}
}
