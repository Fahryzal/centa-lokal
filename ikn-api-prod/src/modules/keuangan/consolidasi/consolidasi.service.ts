import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
@Injectable()
export class ConsolidasiService {
	constructor(private readonly prisma: PrismaService) {}

	async getConsolidatedReport(period: string) {
		const allLedgers = await this.prisma.generalLedger.findMany({
			where: { period },
			include: {
				account: {
					include: {
						accountType: true,
					},
				},
			},
		});

		// Eliminasi transaksi antar unit (misalnya akun dengan kode khusus)
		const eliminatedAccounts = ['hutang-ke-unit-rn', 'hutang-ke-unit-ra']; // contoh kode akun intercompany

		const filteredLedgers = allLedgers.filter((ledger) => {
			return !eliminatedAccounts.includes(ledger.account.code);
		});

		const groupedByAccountType: Record<string, { debit: number; credit: number }> = {};

		for (const entry of filteredLedgers) {
			const type = entry.account.accountType.name;
			if (!groupedByAccountType[type]) {
				groupedByAccountType[type] = { debit: 0, credit: 0 };
			}
			groupedByAccountType[type].debit += Number(entry.debitTotal);
			groupedByAccountType[type].credit += Number(entry.creditTotal);
		}

		// Hitung Laporan Keuangan
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

	async getConsolidatedReportV2(period: string) {
		const start = dayjs(period).startOf('month').toDate(); // 2025-08-01 00:00:00
		const end = dayjs(period).endOf('month').toDate(); // 2025-08-31 23:59:59
		const journalDetails = await this.prisma.journalEntryDetail.findMany({
			where: {
				journalEntry: {
					isPosted: true,
					date: {
						gte: start,
						lte: end,
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
