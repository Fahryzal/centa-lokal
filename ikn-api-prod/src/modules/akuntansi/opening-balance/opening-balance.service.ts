import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
import { CreateOpeningBalanceDto } from './dto/create-opening-balance.dto';
import { GetOpeningBalanceDto } from './dto/get-opening-balance.dto';
import { UpdateOpeningBalanceDto } from './dto/update-opening-balance.dto';
@Injectable({ scope: Scope.REQUEST })
export class OpeningBalanceService {
	constructor(private readonly prisma: PrismaService) {}
	async create(createOpeningBalanceDto: CreateOpeningBalanceDto, decoded: DecodeTokenType) {
		return this.prisma.$transaction(async (tx) => {
			if (createOpeningBalanceDto?.rawmItems && createOpeningBalanceDto?.rawmItems.length > 0) {
				await Promise.all(
					createOpeningBalanceDto?.rawmItems?.map(async (item) => {
						const productId = item.id;
						const quantity = item.quantity;
						const nilaiSatuan = item.nilaiSatuan;
						const lastTxn = await tx.inventoryTransactionBarangMentah.findFirst({
							where: { productId },
							orderBy: { transactionDate: 'desc' },
						});
						const currentStock = lastTxn?.stockAfter ?? 0;
						const currentAverage = lastTxn?.averageCostAfter ?? 0;
						const newTotalQty = currentStock + quantity;
						const newTotalValue = currentStock * Number(currentAverage) + quantity * nilaiSatuan;
						const averageCostAfter = newTotalQty === 0 ? 0 : newTotalValue / newTotalQty;
						await tx.inventoryTransactionBarangMentah.create({
							data: {
								productId,
								transactionType: 'IN',
								quantity,
								satuan: item.satuan,
								nilaiSatuan,
								source: 'persediaan',
								averageCostAfter,
								stockAfter: newTotalQty,
								transactionDate: createOpeningBalanceDto.date,
								unitId: createOpeningBalanceDto.unitId,
							},
						});

						await tx.stockSummaryBarangMentah.upsert({
							where: { productId },
							update: {
								stock: newTotalQty,
								averageCost: averageCostAfter,
							},
							create: {
								productId,
								stock: newTotalQty,
								averageCost: averageCostAfter,
								transactionDate: createOpeningBalanceDto.date,
							},
						});
					}),
				);
			}

			const journalEntry = await tx.openingBalanceHeader.create({
				data: {
					fiscalYear: createOpeningBalanceDto.fiscalYear,
					staffId: decoded.id,
					unitId: createOpeningBalanceDto.unitId,
					notes: createOpeningBalanceDto.notes,
					date: createOpeningBalanceDto.date,
					totalBalance: createOpeningBalanceDto.totalBalance,
					details: {
						create: createOpeningBalanceDto.details.map((items) => ({
							debit: items.debit,
							accountCode: items.accountCode,
							credit: items.credit,
							fiscalYear: createOpeningBalanceDto.fiscalYear,
							unitId: createOpeningBalanceDto.unitId,
							staffId: decoded.id,
						})), // Filter untuk mengabaikan entry kosong
					},
					openingMaterialItems: {
						createMany: {
							data:
								createOpeningBalanceDto?.rawmItems?.map((item) => ({
									...item,
									productId: item.id,
								})) || [],
						},
					},
				},
			});
			return journalEntry;
		});
	}

	private getPeriod(date: string): string {
		const d = new Date(date);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
	}

	async createPostOpeningBalance(journalId: string, decoded: DecodeTokenType) {
		const journal = await this.prisma.openingBalanceHeader.findUnique({
			where: { id: journalId },
			include: { details: true },
		});
		if (!journal) throw new NotFoundException('Journal not found');

		const period = this.getPeriod(journal.date.toISOString());
		// 1. Cek: apakah periode sudah dikunci?
		const existingPeriod = await this.prisma.accountingPeriod.findUnique({
			where: { period },
		});

		if (existingPeriod?.isLocked) {
			throw new BadRequestException('Periode sudah dikunci');
		}

		// 2. Jika belum ada entri periode, buat sekarang
		if (!existingPeriod) {
			await this.prisma.accountingPeriod.create({
				data: {
					period,
					isLocked: false,
					lockedAt: null,
				},
			});
		}

		for (const item of journal.details) {
			const { accountCode, debit: debitRection, credit: creditDirection } = item;
			const existingLedger = await this.prisma.generalLedger.findUnique({
				where: {
					unit_accountCode_periode: {
						accountCode,
						period,
						unitId: journal.unitId,
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
						unitId: journal.unitId,
					},
				});
			} else {
				await this.prisma.generalLedger.update({
					where: {
						unit_accountCode_periode: {
							accountCode,
							period,
							unitId: journal.unitId,
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
		await this.prisma.openingBalanceHeader.update({
			where: { id: journalId },
			data: { status: 'confirmed' },
		});

		return { message: 'Journal posted successfully', journalId };
	}

	async findAll(query: GetOpeningBalanceDto, decoded: DecodeTokenType) {
		const { page = 1, limit = 10, fiscalYear, notes, status, namaUnit, nameStaff, date, totalBalance, isMaterial } = query;

		const skip = (page - 1) * limit;
		const take = +limit;
		let whereCondition: any = {};

		if (!(decoded.isRoot === 'Y' || decoded.isPusat)) {
			whereCondition = {
				...whereCondition,
				unitId: decoded.unitId,
			};
		}

		if (date) {
			const start = dayjs(date).startOf('day').toDate();
			const end = dayjs(date).endOf('day').toDate();

			whereCondition.date = {
				gte: start,
				lte: end,
			};
		}

		if (totalBalance) {
			whereCondition.totalBalance = totalBalance;
		}

		if (fiscalYear) {
			whereCondition.fiscalYear = {
				contains: fiscalYear,
				mode: 'insensitive',
			};
		}

		if (notes) {
			whereCondition.notes = {
				contains: notes,
				mode: 'insensitive',
			};
		}

		if (status) {
			whereCondition.status = {
				contains: status,
				mode: 'insensitive',
			};
		}

		if (namaUnit) {
			whereCondition = {
				...whereCondition,
				unit: {
					nama: namaUnit,
				},
			};
		}

		if (nameStaff) {
			whereCondition = {
				...whereCondition,
				staff: {
					name: nameStaff,
				},
			};
		}

		if (isMaterial === 'Y') {
			whereCondition = {
				...whereCondition,
				openingMaterialItems: {
					some: {}, // artinya minimal ada satu record terkait
				},
			};
		}

		if (isMaterial === 'N') {
			whereCondition = {
				...whereCondition,
				openingMaterialItems: {
					none: {}, // artinya minimal ada satu record terkait
				},
			};
		}

		whereCondition = {
			...whereCondition,
			isRevert: 'N',
		};

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.openingBalanceHeader.findMany({
				skip,
				take,
				include: {
					staff: true,
					unit: true,
					openingMaterialItems: true,
				},
				where: whereCondition,
			}),
			this.prisma.openingBalanceHeader.count({ where: whereCondition }),
		]);

		return {
			data,
			page: +page,
			limit: +limit,
			totalData,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: string) {
		return this.prisma.openingBalanceHeader.findUnique({
			include: {
				details: {
					include: {
						account: true,
					},
				},
				openingMaterialItems: true,
				staff: true,
				unit: true,
			},
			where: {
				id: id,
			},
		});
	}

	update(id: string, updateOpeningBalanceDto: UpdateOpeningBalanceDto, decoded: DecodeTokenType) {
		return this.prisma.$transaction(async (tx) => {
			// 1. Ambil header lama untuk validasi
			const journal = await tx.openingBalanceHeader.findUnique({
				where: { id },
				include: { details: true, openingMaterialItems: true },
			});
			if (!journal) throw new NotFoundException('Opening not found');
			if (updateOpeningBalanceDto?.rawmItems && updateOpeningBalanceDto?.rawmItems.length > 0) {
				// 2. Rollback inventory transactions yang dibuat oleh opening balance ini
				// Ambil productIds dari opening items
				const oldProductIds = journal.openingMaterialItems.map((i) => i.productId);
				// Cari productId dari master barang mentah berdasarkan itemCode
				await tx.inventoryTransactionBarangMentah.deleteMany({
					where: {
						source: 'persediaan',
						transactionDate: journal.date,
						productId: { in: oldProductIds },
						unitId: journal.unitId,
					},
				});

				// 3. Recalculate stockSummary untuk setiap produk lama setelah rollback
				await Promise.all(
					oldProductIds.map(async (productId) => {
						const lastTxn = await tx.inventoryTransactionBarangMentah.findFirst({
							where: { productId },
							orderBy: { transactionDate: 'desc' },
						});

						await tx.stockSummaryBarangMentah.upsert({
							where: { productId },
							update: {
								stock: lastTxn?.stockAfter ?? 0,
								averageCost: lastTxn?.averageCostAfter ? Number(lastTxn.averageCostAfter) : 0,
							},
							create: {
								productId,
								stock: 0,
								averageCost: 0,
								transactionDate: updateOpeningBalanceDto.date,
							},
						});
					}),
				);

				await Promise.all(
					(updateOpeningBalanceDto.rawmItems ?? []).map(async (item) => {
						// Lookup productId dari master berdasarkan itemCode

						const productId = item.productId;
						const quantity = item.quantity;
						const nilaiSatuan = item.nilaiSatuan;

						const lastTxn = await tx.inventoryTransactionBarangMentah.findFirst({
							where: { productId },
							orderBy: { transactionDate: 'desc' },
						});

						const currentStock = lastTxn?.stockAfter ?? 0;
						const currentAverage = lastTxn?.averageCostAfter ?? 0;
						const newTotalQty = currentStock + quantity;
						const newTotalValue = currentStock * Number(currentAverage) + quantity * nilaiSatuan;
						const averageCostAfter = newTotalQty === 0 ? 0 : newTotalValue / newTotalQty;

						await tx.inventoryTransactionBarangMentah.create({
							data: {
								productId,
								transactionType: 'IN',
								quantity,
								satuan: item.satuan,
								nilaiSatuan,
								source: 'persediaan',
								averageCostAfter,
								stockAfter: newTotalQty,
								transactionDate: updateOpeningBalanceDto.date,
								unitId: updateOpeningBalanceDto.unitId,
							},
						});

						await tx.stockSummaryBarangMentah.upsert({
							where: { productId },
							update: {
								stock: newTotalQty,
								averageCost: averageCostAfter,
							},
							create: {
								productId,
								stock: newTotalQty,
								averageCost: averageCostAfter,
								transactionDate: updateOpeningBalanceDto.date,
							},
						});
					}),
				);
			}

			await tx.openingBalanceHeader.update({
				where: {
					id: id,
				},
				data: {
					fiscalYear: updateOpeningBalanceDto.fiscalYear,
					staffId: decoded.id,
					unitId: updateOpeningBalanceDto.unitId,
					notes: updateOpeningBalanceDto.notes,
					date: updateOpeningBalanceDto.date,
					totalBalance: updateOpeningBalanceDto.totalBalance,
					status: 'draft',
				},
			});

			// 3. Delete removed entries
			const existing = await tx.openingBalance.findMany({
				where: { headerId: id },
			});

			const incomingIds = updateOpeningBalanceDto.details.filter((e) => e.id).map((e) => e.id);
			const idsToDelete = existing.filter((entry) => !incomingIds.includes(entry.id)).map((entry) => entry.id);

			if (idsToDelete.length > 0) {
				await tx.openingBalance.deleteMany({
					where: { id: { in: idsToDelete } },
				});
			}
			// 1. Update existing
			await Promise.all(
				updateOpeningBalanceDto.details
					.filter((e) => e.id)
					.map((entry) =>
						tx.openingBalance.update({
							where: { id: entry.id },
							data: {
								accountCode: entry.accountCode,
								debit: entry.debit,
								credit: entry.credit,
								unitId: entry.unitId,
							},
						}),
					),
			);

			await tx.rawMaterialOpeningItem.deleteMany({
				where: {
					openingId: id,
				},
			});

			if (updateOpeningBalanceDto?.rawmItems?.length > 0) {
				await tx.rawMaterialOpeningItem.createMany({
					data: updateOpeningBalanceDto.rawmItems.map((entry) => ({
						openingId: id, // Ensure to include journalEntryId
						productId: entry.productId,
						itemCode: entry.itemCode,
						itemName: entry.itemName,
						accountCode: entry.accountCode,
						unit: entry.unit,
						nilaiSatuan: entry.nilaiSatuan,
						quantity: entry.quantity,
						satuan: entry.satuan,
						stok: entry.stok,
						Total: entry.Total,
					})),
				});
			}

			// 2. Create new
			const toCreate = updateOpeningBalanceDto.details.filter((e) => !e.id);
			if (toCreate.length > 0) {
				await tx.openingBalance.createMany({
					data: toCreate.map((entry) => ({
						headerId: id, // Ensure to include journalEntryId
						accountCode: entry.accountCode,
						debit: entry.debit,
						credit: entry.credit,
						unitId: entry.unitId,
						fiscalYear: updateOpeningBalanceDto.fiscalYear,
						staffId: decoded.id,
					})),
				});
			}

			return { message: 'Journal entries synced successfully' };
		});
	}

	async remove(id: string) {
		return this.prisma.$transaction(async (tx) => {
			// 1. Ambil header untuk validasi + ambil items
			const journal = await tx.openingBalanceHeader.findUnique({
				where: { id },
				include: { openingMaterialItems: true },
			});
			if (!journal) throw new NotFoundException('Opening not found');

			// 2. Rollback inventory transactions
			const productIds = journal?.openingMaterialItems?.map((i) => i.productId).filter(Boolean) || []; // filter null kalau ada yang belum di-map
			if (productIds?.length > 0) {
				await tx.inventoryTransactionBarangMentah.deleteMany({
					where: {
						source: 'persediaan',
						transactionDate: journal.date,
						productId: { in: productIds },
						unitId: journal.unitId,
					},
				});

				// 3. Recalculate stockSummary setelah rollback
				await Promise.all(
					productIds.map(async (productId) => {
						const lastTxn = await tx.inventoryTransactionBarangMentah.findFirst({
							where: { productId },
							orderBy: { transactionDate: 'desc' },
						});

						await tx.stockSummaryBarangMentah.upsert({
							where: { productId },
							update: {
								stock: lastTxn?.stockAfter ?? 0,
								averageCost: lastTxn?.averageCostAfter ? Number(lastTxn.averageCostAfter) : 0,
							},
							create: {
								productId,
								stock: 0,
								averageCost: 0,
								transactionDate: journal.date,
							},
						});
					}),
				);
			}

			// 4. Hapus rawMaterialOpeningItems & details
			await tx.rawMaterialOpeningItem.deleteMany({
				where: { openingId: id },
			});

			await tx.openingBalance.deleteMany({
				where: { headerId: id },
			});

			// 5. Soft delete header
			await tx.openingBalanceHeader.update({
				where: { id },
				data: { deletedAt: new Date() },
			});

			return { message: 'Opening balance deleted successfully' };
		});
	}

	async postOpeningBalanceRevert(id: string, updateOpeningBalanceDto: UpdateOpeningBalanceDto, decoded: DecodeTokenType) {
		return this.prisma.$transaction(async (tx) => {
			// 1. Ambil header lama untuk validasi
			const journal = await tx.openingBalanceHeader.findUnique({
				where: { id },
				include: { details: true },
			});
			if (!journal) throw new NotFoundException('Opening not found');

			const period = this.getPeriod(journal.date.toISOString());
			for (const item of journal.details) {
				const { accountCode, debit: debitRection, credit: creditDirection, unitId } = item;
				const debit = debitRection || 0;
				const credit = creditDirection || 0;
				await tx.generalLedger.update({
					where: {
						unit_accountCode_periode: {
							accountCode,
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

			await tx.openingBalanceHeader.update({
				where: {
					id: id,
				},
				data: {
					status: 'draft',
				},
			});

			return { message: 'Opening balance revert successfully' };
		});
	}

	async openRevert(id: string) {
		return this.prisma.$transaction(async (tx) => {
			const current = await tx.openingBalanceHeader.findUnique({
				where: { id },
				select: { isRevertOpen: true },
			});

			await tx.openingBalanceHeader.update({
				where: { id },
				data: {
					isRevertOpen: !current.isRevertOpen,
				},
			});
		});
	}
}
