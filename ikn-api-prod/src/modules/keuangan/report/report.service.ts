import { Injectable, Scope } from '@nestjs/common';
import { toEndOfDay } from '@src/common/utils/helper/helper';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
import { GetReportDto } from './dto/get-report.dto';

type BalanceSource = {
	fromJournal: number;
	fromOpening: number;
	journalDebit: number;
	journalCredit: number;
	openingDebit: number;
	openingCredit: number;
	fromInitialBalance: number;
	initialBalanceSum: number;
};

@Injectable({ scope: Scope.REQUEST })
export class ReportService {
	constructor(private readonly prisma: PrismaService) {}
	async getIncomeStatement(start: Date, end: Date, unitId: string) {
		const journalWhere: any = {
			date: {
				gte: start,
				lte: toEndOfDay(end),
			},
			isRevert: 'N',
			deletedAt: null,
			isPosted: true,
		};

		if (unitId) {
			journalWhere.unitId = unitId;
		}
		const details = await this.prisma.journalEntryDetail.findMany({
			where: {
				journalEntry: journalWhere,
				account: {
					accountType: {
						// Ambil hanya tipe akun yang masuk ke Laporan Laba Rugi
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

		const grouped = new Map<
			string,
			{
				name: string;
				type: string;
				normalBalance: 'DEBIT' | 'CREDIT';
				debit: number;
				credit: number;
				accountCode: string;
			}
		>();

		for (const detail of details) {
			const key = detail.accountCode;

			const acc = grouped.get(key) || {
				name: detail.account.name,
				type: detail.account.accountType.name,
				normalBalance: detail.account.accountType.normalBalance,
				accountCode: detail.accountCode,
				debit: 0,
				credit: 0,
			};

			acc.debit += Number(detail.debit);
			acc.credit += Number(detail.credit);

			grouped.set(key, acc);
		}

		const revenues = [...grouped.values()].filter((a) => a.type === 'REVENUE');
		const expenses = [...grouped.values()].filter((a) => a.type === 'EXPENSE');

		const totalRevenue = revenues.reduce((sum, acc) => {
			const value = acc.normalBalance === 'CREDIT' ? acc.credit - acc.debit : acc.debit - acc.credit;
			return sum + value;
		}, 0);

		const totalExpense = expenses.reduce((sum, acc) => {
			const value = acc.normalBalance === 'DEBIT' ? acc.debit - acc.credit : acc.credit - acc.debit;
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

	async getBalanceSheet(query: GetReportDto) {
		const { startDate, endDate } = query;
		// 1. Ambil semua jenis akun yang aktif (bisa tambahkan filter jika perlu)
		const accountTypes = await this.prisma.accountType.findMany();
		let whereConditionJournalEntry: any = {
			journalEntry: {
				isPosted: true,
				isRevert: 'N',
				deletedAt: null,
			},
		};

		let whereConditionOpeningBalance: any = {
			header: {
				status: 'confirmed',
				isRevert: 'N',
				deletedAt: null,
			},
		};
		if (startDate && endDate) {
			const start = dayjs(startDate).startOf('day').toDate();
			const end = dayjs(endDate).endOf('day').toDate();

			whereConditionJournalEntry = {
				journalEntry: {
					...whereConditionJournalEntry.journalEntry,
					date: {
						gte: start,
						lte: end,
					},
				},
			};

			whereConditionOpeningBalance = {
				header: {
					...whereConditionJournalEntry.header,
					date: {
						gte: start,
						lte: end,
					},
				},
			};
		}

		// 2. Buat object hasil secara dinamis dari isi tabel
		const result: Record<string, any[]> = {};
		for (const type of accountTypes) {
			result[type.name.toLowerCase()] = [];
		}

		// 3. Ambil semua akun dengan relasi accountType
		const accounts = await this.prisma.account.findMany({
			orderBy: { code: 'asc' },
			include: {
				accountType: true,
				journalDetails: {
					where: whereConditionJournalEntry,
					include: {
						journalEntry: {
							select: {
								id: true,
								numberJurnal: true,
								isPosted: true,
								date: true,
								createdAt: true,
								isRevert: true,
								deletedAt: true,
							},
						},
					},
				},

				OpeningBalance: {
					where: whereConditionOpeningBalance,
					include: {
						header: {
							select: {
								id: true,
								status: true,
								fiscalYear: true,
								date: true,
								createdAt: true,
								isRevert: true,
								deletedAt: true,
							},
						},
					},
				},
			},
		});

		// 4. Hitung saldo per akun dan masukkan ke kategori yang sesuai
		for (const account of accounts) {
			const totalDebit = account.journalDetails.reduce((sum, jd) => sum + Number(jd.debit), 0);
			const totalCredit = account.journalDetails.reduce((sum, jd) => sum + Number(jd.credit), 0);
			const openingDebit = account.OpeningBalance?.reduce((sum, jd) => sum + Number(jd.debit), 0);
			const openingCredit = account.OpeningBalance?.reduce((sum, jd) => sum + Number(jd.credit), 0);

			const type = account.accountType.name;
			const key = type.toLowerCase(); // e.g., "asset", "liability"

			let balance = 0;

			// 👇 Bisa ganti ke config jika ingin benar-benar fleksibel
			if (account.accountType.normalBalance === 'DEBIT') {
				balance = openingDebit - openingCredit + totalDebit - totalCredit;
			} else {
				balance = openingCredit - openingDebit + totalCredit - totalDebit;
			}

			// Masukkan ke dalam result sesuai jenisnya
			if (result[key]) {
				result[key].push({
					code: account.code,
					name: account.name,
					balance,
					typeNeraca: account.typeNeraca,
				});
			}
		}

		return result;
	}

	// async getBalanceSheetParent(query: GetReportDto) {
	// 	const { startDate, endDate, unitId } = query;
	// 	// 1. Ambil semua jenis akun yang aktif (bisa tambahkan filter jika perlu)
	// 	const accountTypes = await this.prisma.accountType.findMany();
	// 	let whereConditionJournalEntry: any = {};
	// 	let whereConditionOpeningBalance: any = {};

	// 	if (startDate && endDate) {
	// 		const start = dayjs(startDate).startOf('day').toDate();
	// 		const end = dayjs(endDate).endOf('day').toDate();

	// 		whereConditionJournalEntry = {
	// 			journalEntry: {
	// 				...whereConditionJournalEntry.journalEntry,
	// 				date: {
	// 					gte: start,
	// 					lte: end,
	// 				},
	// 				isPosted: true,
	// 				isRevert: 'N',
	// 				deletedAt: null,
	// 			},
	// 		};

	// 		whereConditionOpeningBalance = {
	// 			header: {
	// 				...whereConditionOpeningBalance.header, // ✅
	// 				date: { gte: start, lte: end },
	// 				status: 'confirmed',
	// 				isRevert: 'N',
	// 				deletedAt: null,
	// 			},
	// 		};

	// 		if (unitId) {
	// 			whereConditionJournalEntry = {
	// 				journalEntry: {
	// 					...whereConditionJournalEntry.journalEntry,
	// 					unitId: unitId,
	// 				},
	// 			};

	// 			whereConditionOpeningBalance = {
	// 				header: {
	// 					...whereConditionOpeningBalance.header, // ✅ spread dari dirinya sendiri
	// 					unitId: unitId,
	// 				},
	// 			};
	// 		}

	// 		// whereConditionOpeningBalance = {
	// 		// 	header: {
	// 		// 		...whereConditionJournalEntry.header,
	// 		// 		date: {
	// 		// 			gte: start,
	// 		// 			lte: end,
	// 		// 		},
	// 		// 		status: 'confirmed',
	// 		// 		isRevert: 'N',
	// 		// 		deletedAt: null,
	// 		// 	},
	// 		// };
	// 	}

	// 	// if (unitId) {
	// 	// 	whereConditionJournalEntry = {
	// 	// 		journalEntry: {
	// 	// 			...whereConditionJournalEntry.journalEntry,
	// 	// 			unitId: unitId,
	// 	// 		},
	// 	// 	};

	// 	// 	whereConditionOpeningBalance = {
	// 	// 		header: {
	// 	// 			...whereConditionJournalEntry.header,
	// 	// 			unitId: unitId,
	// 	// 		},
	// 	// 	};
	// 	// }

	// 	// 2. Buat object hasil secara dinamis dari isi tabel
	// 	const result: Record<string, any[]> = {};
	// 	for (const type of accountTypes) {
	// 		result[type.name.toLowerCase()] = [];
	// 	}

	// 	// 3. Ambil semua akun dengan relasi accountType
	// 	const accounts = await this.prisma.account.findMany({
	// 		orderBy: { code: 'asc' },
	// 		include: {
	// 			accountType: true,
	// 			journalDetails: {
	// 				where: whereConditionJournalEntry,
	// 				include: {
	// 					journalEntry: {
	// 						select: {
	// 							id: true,
	// 							numberJurnal: true,
	// 							isPosted: true,
	// 							date: true,
	// 							createdAt: true,
	// 							isRevert: true,
	// 							deletedAt: true,
	// 						},
	// 					},
	// 				},
	// 			},

	// 			OpeningBalance: {
	// 				where: whereConditionOpeningBalance,
	// 				include: {
	// 					header: {
	// 						select: {
	// 							id: true,
	// 							status: true,
	// 							fiscalYear: true,
	// 							date: true,
	// 							createdAt: true,
	// 							isRevert: true,
	// 							deletedAt: true,
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	});

	// 	const accountBalanceMap = new Map<string, number>();

	// 	for (const account of accounts) {
	// 		if (account.OpeningBalance.length > 0) {
	// 			console.log(account);
	// 		}
	// 		const totalDebit = account.journalDetails.reduce((s, jd) => s + Number(jd.debit), 0);
	// 		const totalCredit = account.journalDetails.reduce((s, jd) => s + Number(jd.credit), 0);
	// 		const openingDebit = account.OpeningBalance?.reduce((s, jd) => s + Number(jd.debit), 0) ?? 0;
	// 		const openingCredit = account.OpeningBalance?.reduce((s, jd) => s + Number(jd.credit), 0) ?? 0;

	// 		let balance = 0;

	// 		if (account.accountType.normalBalance === 'DEBIT') {
	// 			balance = openingDebit + totalDebit - openingCredit - totalCredit;
	// 		} else {
	// 			balance = openingCredit + totalCredit - openingDebit - totalDebit;
	// 		}

	// 		accountBalanceMap.set(account.code, balance);
	// 	}
	// 	for (const account of accounts) {
	// 		let parentCode = account.parentId;
	// 		const visited = new Set<string>();

	// 		while (parentCode && !visited.has(parentCode)) {
	// 			visited.add(parentCode);

	// 			const childBalance = accountBalanceMap.get(account.code) ?? 0;
	// 			const parentBalance = accountBalanceMap.get(parentCode) ?? 0;

	// 			accountBalanceMap.set(parentCode, parentBalance + childBalance);

	// 			const parentAccount = accounts.find((a) => a.code === parentCode);
	// 			parentCode = parentAccount?.parentId ?? null;
	// 		}
	// 	}

	// 	for (const account of accounts) {
	// 		const type = account.accountType.name.toLowerCase();
	// 		const balance = accountBalanceMap.get(account.code) ?? 0;

	// 		if (result[type]) {
	// 			result[type].push({
	// 				code: account.code,
	// 				name: account.name,
	// 				balance,
	// 				typeNeraca: account.typeNeraca,
	// 				parentId: account.parentId,
	// 			});
	// 		}
	// 	}

	// 	return result;
	// }

	// async getBalanceSheetParent(query: GetReportDto) {
	// 	const { startDate, endDate, unitId } = query;
	// 	const accountTypes = await this.prisma.accountType.findMany();

	// 	// Build where conditions
	// 	let journalWhere: any = {};
	// 	let openingWhere: any = {};

	// 	if (startDate && endDate) {
	// 		const start = dayjs(startDate).startOf('day').toDate();
	// 		const end = dayjs(endDate).endOf('day').toDate();

	// 		journalWhere = {
	// 			journalEntry: {
	// 				date: { gte: start, lte: end },
	// 				isPosted: true,
	// 				isRevert: 'N',
	// 				deletedAt: null,
	// 			},
	// 		};

	// 		openingWhere = {
	// 			header: {
	// 				date: { gte: start, lte: end },
	// 				status: 'confirmed',
	// 				isRevert: 'N',
	// 				deletedAt: null,
	// 			},
	// 		};
	// 	}

	// 	if (unitId) {
	// 		journalWhere = {
	// 			journalEntry: {
	// 				...journalWhere.journalEntry,
	// 				unitId,
	// 			},
	// 		};

	// 		openingWhere = {
	// 			header: {
	// 				...openingWhere.header,
	// 				unitId,
	// 			},
	// 		};
	// 	}

	// 	const accounts = await this.prisma.account.findMany({
	// 		orderBy: { code: 'asc' },
	// 		include: {
	// 			accountType: true,
	// 			journalDetails: {
	// 				where: journalWhere,
	// 				include: {
	// 					journalEntry: {
	// 						select: {
	// 							id: true,
	// 							numberJurnal: true,
	// 							isPosted: true,
	// 							date: true,
	// 							isRevert: true,
	// 							deletedAt: true,
	// 						},
	// 					},
	// 				},
	// 			},
	// 			OpeningBalance: {
	// 				where: openingWhere,
	// 				include: {
	// 					header: {
	// 						select: {
	// 							id: true,
	// 							status: true,
	// 							fiscalYear: true,
	// 							date: true,
	// 							isRevert: true,
	// 							deletedAt: true,
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	});

	// 	const accountMap = new Map(accounts.map((a) => [a.code, a]));

	// 	// Step 1: Hitung "own balance" tiap akun (transaksi langsung, tanpa child)
	// 	const ownBalanceMap = new Map<string, number>();

	// 	for (const account of accounts) {
	// 		const totalDebit = account.journalDetails.reduce((s, jd) => s + Number(jd.debit), 0);
	// 		const totalCredit = account.journalDetails.reduce((s, jd) => s + Number(jd.credit), 0);
	// 		const openingDebit = account.OpeningBalance.reduce((s, ob) => s + Number(ob.debit), 0);
	// 		const openingCredit = account.OpeningBalance.reduce((s, ob) => s + Number(ob.credit), 0);

	// 		let balance = 0;
	// 		if (account.accountType.normalBalance === 'DEBIT') {
	// 			balance = openingDebit + totalDebit - openingCredit - totalCredit;
	// 		} else {
	// 			balance = openingCredit + totalCredit - openingDebit - totalDebit;
	// 		}

	// 		ownBalanceMap.set(account.code, balance);
	// 	}

	// 	// Step 2: Recursive accumulate — hitung total balance (own + semua descendant)
	// 	// Pakai memoization supaya tiap node dihitung sekali saja
	// 	const totalBalanceMap = new Map<string, number>();

	// 	function getTotal(code: string, visiting = new Set<string>()): number {
	// 		if (totalBalanceMap.has(code)) return totalBalanceMap.get(code)!;
	// 		if (visiting.has(code)) {
	// 			console.warn(`Circular reference detected at account code: ${code}`);
	// 			return 0;
	// 		}

	// 		visiting.add(code);

	// 		const account = accountMap.get(code);
	// 		if (!account) return 0;

	// 		const own = ownBalanceMap.get(code) ?? 0;

	// 		// Cari semua children langsung
	// 		const children = accounts.filter((a) => a.parentId === code);
	// 		const childTotal = children.reduce((sum, child) => sum + getTotal(child.code, visiting), 0);

	// 		const total = own + childTotal;
	// 		totalBalanceMap.set(code, total);
	// 		visiting.delete(code);

	// 		return total;
	// 	}

	// 	// Panggil untuk semua akun
	// 	for (const account of accounts) {
	// 		getTotal(account.code);
	// 	}

	// 	// Step 3: Build result
	// 	const result: Record<string, any[]> = {};
	// 	for (const type of accountTypes) {
	// 		result[type.name.toLowerCase()] = [];
	// 	}

	// 	for (const account of accounts) {
	// 		const type = account.accountType.name.toLowerCase();
	// 		const balance = totalBalanceMap.get(account.code) ?? 0;

	// 		if (result[type]) {
	// 			result[type].push({
	// 				code: account.code,
	// 				name: account.name,
	// 				balance,
	// 				ownBalance: ownBalanceMap.get(account.code) ?? 0, // opsional, untuk debug
	// 				typeNeraca: account.typeNeraca,
	// 				parentId: account.parentId,
	// 			});
	// 		}
	// 	}

	// 	return result;
	// }

	// async getBalanceSheetParent(query: GetReportDto) {
	// 	const { startDate, endDate, unitId } = query;
	// 	const accountTypes = await this.prisma.accountType.findMany();

	// 	let journalWhere: any = {};
	// 	let openingWhere: any = {};

	// 	if (startDate && endDate) {
	// 		const start = dayjs(startDate).startOf('day').toDate();
	// 		const end = dayjs(endDate).endOf('day').toDate();

	// 		journalWhere = {
	// 			journalEntry: {
	// 				date: { gte: start, lte: end },
	// 				isPosted: true,
	// 				isRevert: 'N',
	// 				deletedAt: null,
	// 			},
	// 		};

	// 		openingWhere = {
	// 			header: {
	// 				date: { gte: start, lte: end },
	// 				status: 'confirmed',
	// 				isRevert: 'N',
	// 				deletedAt: null,
	// 			},
	// 		};
	// 	}

	// 	if (unitId) {
	// 		journalWhere = {
	// 			journalEntry: { ...journalWhere.journalEntry, unitId },
	// 		};
	// 		openingWhere = {
	// 			header: { ...openingWhere.header, unitId },
	// 		};
	// 	}

	// 	const accounts = await this.prisma.account.findMany({
	// 		orderBy: { code: 'asc' },
	// 		include: {
	// 			accountType: true,
	// 			journalDetails: {
	// 				where: journalWhere,
	// 				include: {
	// 					journalEntry: {
	// 						select: {
	// 							id: true,
	// 							numberJurnal: true,
	// 							isPosted: true,
	// 							date: true,
	// 							isRevert: true,
	// 							deletedAt: true,
	// 							unitId: true,
	// 						},
	// 					},
	// 				},
	// 			},

	// 			OpeningBalance: {
	// 				where: openingWhere,
	// 				include: {
	// 					header: {
	// 						select: {
	// 							id: true,
	// 							status: true,
	// 							fiscalYear: true,
	// 							date: true,
	// 							isRevert: true,
	// 							deletedAt: true,
	// 							unitId: true,
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	});

	// 	const accountMap = new Map(accounts.map((a) => [a.code, a]));

	// 	// ----------------------------------------------------------------
	// 	// Step 1: Hitung own balance tiap akun (tanpa child)
	// 	// ----------------------------------------------------------------
	// 	const ownBalanceMap = new Map<string, number>();
	// 	// ✅ fixed
	// 	const balanceSourceMap = new Map<string, BalanceSource>();

	// 	for (const account of accounts) {
	// 		const totalDebit = account.journalDetails.reduce((s, jd) => s + Number(jd.debit), 0);
	// 		const totalCredit = account.journalDetails.reduce((s, jd) => s + Number(jd.credit), 0);
	// 		const openingDebit = account.OpeningBalance.reduce((s, ob) => s + Number(ob.debit), 0);
	// 		const openingCredit = account.OpeningBalance.reduce((s, ob) => s + Number(ob.credit), 0);

	// 		let fromJournal = 0;
	// 		let fromOpening = 0;

	// 		if (account.accountType.normalBalance === 'DEBIT') {
	// 			fromJournal = totalDebit - totalCredit;
	// 			fromOpening = openingDebit - openingCredit;
	// 		} else {
	// 			fromJournal = totalCredit - totalDebit;
	// 			fromOpening = openingCredit - openingDebit;
	// 		}

	// 		ownBalanceMap.set(account.code, fromOpening + fromJournal);
	// 		balanceSourceMap.set(account.code, {
	// 			fromJournal,
	// 			fromOpening,
	// 			journalDebit: totalDebit,
	// 			journalCredit: totalCredit,
	// 			openingDebit,
	// 			openingCredit,
	// 		});
	// 	}

	// 	// ----------------------------------------------------------------
	// 	// Step 2: Recursive accumulate dengan memoization
	// 	// ----------------------------------------------------------------
	// 	const totalBalanceMap = new Map<string, number>();
	// 	const totalSourceMap = new Map<string, { fromJournal: number; fromOpening: number }>();

	// 	function getTotal(code: string, visiting = new Set<string>()): number {
	// 		if (totalBalanceMap.has(code)) return totalBalanceMap.get(code)!;
	// 		if (visiting.has(code)) {
	// 			console.warn(`Circular reference detected at account code: ${code}`);
	// 			return 0;
	// 		}

	// 		visiting.add(code);

	// 		const account = accountMap.get(code);
	// 		if (!account) return 0;

	// 		const own = ownBalanceMap.get(code) ?? 0;
	// 		const ownSource = balanceSourceMap.get(code) ?? { fromJournal: 0, fromOpening: 0 };

	// 		const children = accounts.filter((a) => a.parentId === code);

	// 		let childJournal = 0;
	// 		let childOpening = 0;

	// 		const childTotal = children.reduce((sum, child) => {
	// 			const childBalance = getTotal(child.code, visiting);
	// 			const childSource = totalSourceMap.get(child.code);
	// 			childJournal += childSource?.fromJournal ?? 0;
	// 			childOpening += childSource?.fromOpening ?? 0;
	// 			return sum + childBalance;
	// 		}, 0);

	// 		totalBalanceMap.set(code, own + childTotal);
	// 		totalSourceMap.set(code, {
	// 			fromJournal: ownSource.fromJournal + childJournal,
	// 			fromOpening: ownSource.fromOpening + childOpening,
	// 		});

	// 		visiting.delete(code);
	// 		return own + childTotal;
	// 	}

	// 	for (const account of accounts) {
	// 		getTotal(account.code);
	// 	}

	// 	// ----------------------------------------------------------------
	// 	// Step 3: Helper resolve dominant source
	// 	// ----------------------------------------------------------------
	// 	function resolveDominant(source: { fromJournal: number; fromOpening: number }) {
	// 		if (source.fromOpening !== 0 && source.fromJournal === 0) return 'opening';
	// 		if (source.fromJournal !== 0 && source.fromOpening === 0) return 'journal';
	// 		if (source.fromOpening === 0 && source.fromJournal === 0) return 'none';
	// 		return 'mixed';
	// 	}

	// 	// ----------------------------------------------------------------
	// 	// Step 4: Build node (dipakai untuk root dan children rekursif)
	// 	// ----------------------------------------------------------------
	// 	function buildNode(account: (typeof accounts)[0]): any {
	// 		const ownSource = balanceSourceMap.get(account.code) ?? {
	// 			fromJournal: 0,
	// 			fromOpening: 0,
	// 			journalDebit: 0,
	// 			journalCredit: 0,
	// 			openingDebit: 0,
	// 			openingCredit: 0,
	// 		};
	// 		const totalSource = totalSourceMap.get(account.code) ?? { fromJournal: 0, fromOpening: 0 };
	// 		console.log('OpeningBalance', account.OpeningBalance);
	// 		return {
	// 			code: account.code,
	// 			name: account.name,
	// 			parentId: account.parentId,
	// 			parentName: account.parentName,
	// 			typeNeraca: account.typeNeraca,
	// 			normalBalance: account.accountType.normalBalance,
	// 			balance: totalBalanceMap.get(account.code) ?? 0,
	// 			ownBalance: ownBalanceMap.get(account.code) ?? 0,
	// 			source: {
	// 				dominant: resolveDominant(totalSource),
	// 				fromJournal: totalSource.fromJournal,
	// 				fromOpening: totalSource.fromOpening,
	// 			},
	// 			ownSource: {
	// 				dominant: resolveDominant(ownSource),
	// 				journalDebit: ownSource.journalDebit,
	// 				journalCredit: ownSource.journalCredit,
	// 				openingDebit: ownSource.openingDebit,
	// 				openingCredit: ownSource.openingCredit,
	// 				fromJournal: ownSource.fromJournal,
	// 				fromOpening: ownSource.fromOpening,
	// 			},
	// 			// Detail transaksi (untuk monitoring)
	// 			...(account.journalDetails.length > 0 && {
	// 				journalTransactions: account.journalDetails.map((jd) => ({
	// 					numberJurnal: jd.journalEntry.numberJurnal,
	// 					date: jd.journalEntry.date,
	// 					debit: Number(jd.debit),
	// 					credit: Number(jd.credit),
	// 					unitId: jd.journalEntry.unitId,
	// 				})),
	// 			}),
	// 			...(account.OpeningBalance.length > 0 && {
	// 				openingTransactions: account.OpeningBalance.map((ob) => ({
	// 					headerId: ob.header.id,
	// 					fiscalYear: ob.header.fiscalYear,
	// 					date: ob.header.date,
	// 					debit: Number(ob.debit),
	// 					credit: Number(ob.credit),
	// 					unitId: ob.header.unitId,
	// 				})),
	// 			}),
	// 			// Rekursif children
	// 			children: buildChildren(account.code),
	// 		};
	// 	}

	// 	// ----------------------------------------------------------------
	// 	// Step 5: Build children tree rekursif
	// 	// ----------------------------------------------------------------
	// 	function buildChildren(parentCode: string): any[] {
	// 		return accounts.filter((a) => a.parentId === parentCode).map((child) => buildNode(child));
	// 	}

	// 	// ----------------------------------------------------------------
	// 	// Step 6: Build result — hanya root accounts (parentId null)
	// 	// ----------------------------------------------------------------
	// 	const result: Record<string, any[]> = {};
	// 	for (const type of accountTypes) {
	// 		result[type.name.toLowerCase()] = [];
	// 	}

	// 	for (const account of accounts) {
	// 		// Hanya root account yang di-push langsung ke result
	// 		if (!account.parentId) {
	// 			const type = account.accountType.name.toLowerCase();
	// 			if (result[type]) {
	// 				result[type].push(buildNode(account));
	// 			}
	// 		}
	// 	}

	// 	return result;
	// }

	async getBalanceSheetParent(query: GetReportDto) {
		const { startDate, endDate, unitId } = query;
		const accountTypes = await this.prisma.accountType.findMany();

		let journalWhere: any = {};
		let openingWhere: any = {};
		const bankAccountWhere: any = { deletedAt: null };

		// Period selalu diturunkan dari startDate (format YYYY-MM), contoh: "2026-01"
		// Kalau GetReportDto sudah punya field `period` sendiri, prioritaskan itu.
		const period = (query as any).period ?? (startDate ? dayjs(startDate).format('YYYY-MM') : undefined);

		if (startDate && endDate) {
			const start = dayjs(startDate).startOf('day').toDate();
			const end = dayjs(endDate).endOf('day').toDate();

			journalWhere = {
				journalEntry: {
					date: { gte: start, lte: end },
					isPosted: true,
					isRevert: 'N',
					deletedAt: null,
				},
			};

			openingWhere = {
				header: {
					date: { gte: start, lte: end },
					status: 'confirmed',
					isRevert: 'N',
					deletedAt: null,
				},
			};
		}

		if (period) {
			bankAccountWhere.period = period;
		}

		if (unitId) {
			journalWhere = {
				journalEntry: { ...journalWhere.journalEntry, unitId },
			};
			openingWhere = {
				header: { ...openingWhere.header, unitId },
			};
			bankAccountWhere.unitId = unitId;
		}

		const accounts = await this.prisma.account.findMany({
			orderBy: { code: 'asc' },
			include: {
				accountType: true,
				journalDetails: {
					where: journalWhere,
					include: {
						journalEntry: {
							select: {
								id: true,
								numberJurnal: true,
								isPosted: true,
								date: true,
								isRevert: true,
								deletedAt: true,
								unitId: true,
							},
						},
					},
				},

				OpeningBalance: {
					where: openingWhere,
					include: {
						header: {
							select: {
								id: true,
								status: true,
								fiscalYear: true,
								date: true,
								isRevert: true,
								deletedAt: true,
								unitId: true,
							},
						},
					},
				},

				// ✅ tambahan: saldo awal rekening bank per periode
				bankAccount: {
					where: bankAccountWhere,
					select: {
						id: true,
						initialBalance: true,
						period: true,
						unitId: true,
						bankName: true,
						bankAccountNumber: true,
						isPosted: true,
					},
				},
			},
		});

		const accountMap = new Map(accounts.map((a) => [a.code, a]));

		// ----------------------------------------------------------------
		// Step 1: Hitung own balance tiap akun (tanpa child)
		// ----------------------------------------------------------------
		const ownBalanceMap = new Map<string, number>();
		const balanceSourceMap = new Map<string, BalanceSource>();

		for (const account of accounts) {
			const totalDebit = account.journalDetails.reduce((s, jd) => s + Number(jd.debit), 0);
			const totalCredit = account.journalDetails.reduce((s, jd) => s + Number(jd.credit), 0);
			const openingDebit = account.OpeningBalance.reduce((s, ob) => s + Number(ob.debit), 0);
			const openingCredit = account.OpeningBalance.reduce((s, ob) => s + Number(ob.credit), 0);

			// ✅ initialBalance BankAccount selalu diperlakukan sebagai debit
			const initialBalanceSum = account.bankAccount
				.filter((ba) => ba.isPosted)
				.reduce((acc, ba) => acc + Number(ba.initialBalance), 0);

			let fromJournal = 0;
			let fromOpening = 0;
			let fromInitialBalance = 0;

			if (account.accountType.normalBalance === 'DEBIT') {
				fromJournal = totalDebit - totalCredit;
				fromOpening = openingDebit - openingCredit;
				fromInitialBalance = initialBalanceSum; // debit menambah saldo akun DEBIT
			} else {
				fromJournal = totalCredit - totalDebit;
				fromOpening = openingCredit - openingDebit;
				fromInitialBalance = -initialBalanceSum; // debit mengurangi saldo akun CREDIT
			}

			ownBalanceMap.set(account.code, fromOpening + fromJournal + fromInitialBalance);
			balanceSourceMap.set(account.code, {
				fromJournal,
				fromOpening,
				fromInitialBalance,
				initialBalanceSum,
				journalDebit: totalDebit,
				journalCredit: totalCredit,
				openingDebit,
				openingCredit,
			});
		}

		// ----------------------------------------------------------------
		// Step 2: Recursive accumulate dengan memoization
		// ----------------------------------------------------------------
		const totalBalanceMap = new Map<string, number>();
		const totalSourceMap = new Map<string, { fromJournal: number; fromOpening: number; fromInitialBalance: number }>();

		function getTotal(code: string, visiting = new Set<string>()): number {
			if (totalBalanceMap.has(code)) return totalBalanceMap.get(code)!;
			if (visiting.has(code)) {
				console.warn(`Circular reference detected at account code: ${code}`);
				return 0;
			}

			visiting.add(code);

			const account = accountMap.get(code);
			if (!account) return 0;

			const own = ownBalanceMap.get(code) ?? 0;
			const ownSource = balanceSourceMap.get(code) ?? { fromJournal: 0, fromOpening: 0, fromInitialBalance: 0 };

			const children = accounts.filter((a) => a.parentId === code);

			let childJournal = 0;
			let childOpening = 0;
			let childInitialBalance = 0;

			const childTotal = children.reduce((sum, child) => {
				const childBalance = getTotal(child.code, visiting);
				const childSource = totalSourceMap.get(child.code);
				childJournal += childSource?.fromJournal ?? 0;
				childOpening += childSource?.fromOpening ?? 0;
				childInitialBalance += childSource?.fromInitialBalance ?? 0;
				return sum + childBalance;
			}, 0);

			totalBalanceMap.set(code, own + childTotal);
			totalSourceMap.set(code, {
				fromJournal: ownSource.fromJournal + childJournal,
				fromOpening: ownSource.fromOpening + childOpening,
				fromInitialBalance: ownSource.fromInitialBalance + childInitialBalance,
			});

			visiting.delete(code);
			return own + childTotal;
		}

		for (const account of accounts) {
			getTotal(account.code);
		}

		// ----------------------------------------------------------------
		// Step 3: Helper resolve dominant source
		// ----------------------------------------------------------------
		function resolveDominant(source: { fromJournal: number; fromOpening: number; fromInitialBalance?: number }) {
			const nonZero = [
				source.fromOpening !== 0 ? 'opening' : null,
				source.fromJournal !== 0 ? 'journal' : null,
				source.fromInitialBalance ? 'initialBalance' : null,
			].filter(Boolean);

			if (nonZero.length === 0) return 'none';
			if (nonZero.length === 1) return nonZero[0];
			return 'mixed';
		}

		// ----------------------------------------------------------------
		// Step 4: Build node (dipakai untuk root dan children rekursif)
		// ----------------------------------------------------------------
		function buildNode(account: (typeof accounts)[0]): any {
			const ownSource = balanceSourceMap.get(account.code) ?? {
				fromJournal: 0,
				fromOpening: 0,
				fromInitialBalance: 0,
				initialBalanceSum: 0,
				journalDebit: 0,
				journalCredit: 0,
				openingDebit: 0,
				openingCredit: 0,
			};
			const totalSource = totalSourceMap.get(account.code) ?? {
				fromJournal: 0,
				fromOpening: 0,
				fromInitialBalance: 0,
			};

			return {
				code: account.code,
				name: account.name,
				parentId: account.parentId,
				parentName: account.parentName,
				typeNeraca: account.typeNeraca,
				normalBalance: account.accountType.normalBalance,
				balance: totalBalanceMap.get(account.code) ?? 0,
				ownBalance: ownBalanceMap.get(account.code) ?? 0,
				source: {
					dominant: resolveDominant(totalSource),
					fromJournal: totalSource.fromJournal,
					fromOpening: totalSource.fromOpening,
					fromInitialBalance: totalSource.fromInitialBalance,
				},
				ownSource: {
					dominant: resolveDominant(ownSource),
					journalDebit: ownSource.journalDebit,
					journalCredit: ownSource.journalCredit,
					openingDebit: ownSource.openingDebit,
					openingCredit: ownSource.openingCredit,
					initialBalanceSum: ownSource.initialBalanceSum,
					fromJournal: ownSource.fromJournal,
					fromOpening: ownSource.fromOpening,
					fromInitialBalance: ownSource.fromInitialBalance,
				},
				...(account.journalDetails.length > 0 && {
					journalTransactions: account.journalDetails.map((jd) => ({
						numberJurnal: jd.journalEntry.numberJurnal,
						date: jd.journalEntry.date,
						debit: Number(jd.debit),
						credit: Number(jd.credit),
						unitId: jd.journalEntry.unitId,
					})),
				}),
				...(account.OpeningBalance.length > 0 && {
					openingTransactions: account.OpeningBalance.map((ob) => ({
						headerId: ob.header.id,
						fiscalYear: ob.header.fiscalYear,
						date: ob.header.date,
						debit: Number(ob.debit),
						credit: Number(ob.credit),
						unitId: ob.header.unitId,
					})),
				}),
				// ✅ tambahan: detail saldo awal rekening bank
				...(account.bankAccount.length > 0 && {
					bankAccountTransactions: account.bankAccount.map((ba) => ({
						id: ba.id,
						bankName: ba.bankName,
						bankAccountNumber: ba.bankAccountNumber,
						period: ba.period,
						initialBalance: Number(ba.initialBalance),
						unitId: ba.unitId,
					})),
				}),
				children: buildChildren(account.code),
			};
		}

		function buildChildren(parentCode: string): any[] {
			return accounts.filter((a) => a.parentId === parentCode).map((child) => buildNode(child));
		}

		// ----------------------------------------------------------------
		// Step 6: Build result — hanya root accounts (parentId null)
		// ----------------------------------------------------------------
		const result: Record<string, any[]> = {};
		for (const type of accountTypes) {
			result[type.name.toLowerCase()] = [];
		}

		for (const account of accounts) {
			if (!account.parentId) {
				const type = account.accountType.name.toLowerCase();
				if (result[type]) {
					result[type].push(buildNode(account));
				}
			}
		}

		return result;
	}

	async getCashFlow(startDate: Date, endDate: Date, unitId: string) {
		const whereCondition: any = {
			date: {
				gte: startDate,
				lte: toEndOfDay(endDate),
			},
		};

		if (unitId) {
			whereCondition.unitId = unitId;
		}
		const transactions = await this.prisma.cashBankTransaction.findMany({
			where: whereCondition,
			include: {
				account: true,
				bank_account: {
					include: {
						account: true,
					},
				},
			},
			orderBy: { date: 'asc' },
		});

		let totalIn = 0;
		let totalOut = 0;

		const items = transactions.map((t) => {
			if (t.type === 'CASH_IN') {
				totalIn += t.amountInIDR;
			} else {
				totalOut += t.amountInIDR;
			}

			return {
				date: t.date,
				accountName: (t.bank_account?.account?.name || t.account?.name) ?? 'N/A',
				description: t.description,
				amount: t.amountInIDR,
				type: t.type,
			};
		});

		return {
			totalIn,
			totalOut,
			netCashFlow: totalIn - totalOut,
			items,
		};
	}
}
