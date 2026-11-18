import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
import { CreateBarangMentahDto } from './dto/create-barang-mentah.dto';
import { GetBarangMentahDto } from './dto/get-barang-mentah.dto';
import { UpdateBarangMentahDto } from './dto/update-barang-mentah.dto';

@Injectable({ scope: Scope.REQUEST })
export class BarangMentahService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal,
	) {}
	create(createBarangMentahDto: CreateBarangMentahDto) {
		return this.prisma.masterRawMaterial.create({
			data: {
				accountCode: createBarangMentahDto.accountCode,
				itemCode: createBarangMentahDto.itemCode,
				itemName: createBarangMentahDto.itemName,
				unitId: createBarangMentahDto.unitId,
				satuan: createBarangMentahDto.satuan,
			},
		});
	}

	async findAll(query: GetBarangMentahDto) {
		const {
			page = 1,
			limit = 10,
			itemCode,
			sortBy,
			sortOrder,
			itemName,
			satuan,
			unit,
			accountCode,
			account,
			unitId,
			month,
			year,
		} = query;

		if ((month != null && year == null) || (month == null && year != null)) {
			throw new BadRequestException('Filter month dan year harus diisi bersamaan.');
		}

		if (month != null && (!Number.isInteger(Number(month)) || Number(month) < 1 || Number(month) > 12)) {
			throw new BadRequestException('Month harus bernilai antara 1 sampai 12.');
		}

		if (year != null && (!Number.isInteger(Number(year)) || Number(year) < 2000)) {
			throw new BadRequestException('Year tidak valid.');
		}

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder);
		const skip = (page - 1) * limit;
		const take = +limit;
		const whereCondition: any = {};

		if (accountCode) {
			whereCondition.accountCode = {
				contains: accountCode,
				mode: 'insensitive',
			};
		}

		if (unitId) {
			const unitIds = unitId
				.split(',')
				.map((id) => id.trim())
				.filter(Boolean);

			if (unitIds.length === 1) {
				// Perilaku lama: filter satu unit
				whereCondition.unitId = unitIds[0];
			} else if (unitIds.length > 1) {
				// Perilaku baru: filter beberapa unit
				whereCondition.unitId = {
					in: unitIds,
				};
			}
		}

		if (itemCode) {
			whereCondition.itemCode = {
				contains: itemCode,
				mode: 'insensitive',
			};
		}

		if (itemName) {
			whereCondition.itemName = {
				contains: itemName,
				mode: 'insensitive',
			};
		}

		if (satuan) {
			whereCondition.satuan = {
				contains: satuan,
				mode: 'insensitive',
			};
		}

		if (unit) {
			whereCondition.unit = {
				nama: {
					contains: unit,
					mode: 'insensitive',
				},
			};
		}

		if (account) {
			whereCondition.account = {
				...whereCondition,
				name: {
					contains: account,
					mode: 'insensitive',
				},
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.masterRawMaterial.findMany({
				skip,
				take,
				where: whereCondition,
				orderBy: orderBy ?? { createdAt: 'desc' },
				include: {
					unit: true,
					account: true,
				},
			}),
			this.prisma.masterRawMaterial.count({
				where: whereCondition,
			}),
		]);

		const productIds = data.map((item) => item.id);

		const stockMap = new Map<string, { stock: number; averageCost: number }>();

		if (month != null && year != null) {
			// Batas akhir bulan yang dipilih.
			const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

			if (productIds.length > 0) {
				// Hitung seluruh transaksi aktif sampai akhir periode.
				// Transaksi bulan-bulan sebelumnya ikut membentuk saldo.
				const [stokMasuk, stokKeluar, stockSummaries] = await Promise.all([
					this.prisma.inventoryTransactionBarangMentah.groupBy({
						by: ['productId'],
						where: {
							productId: { in: productIds },
							transactionType: 'IN',
							transactionDate: { lte: endDate },
							deletedAt: null,
						},
						_sum: {
							quantity: true,
						},
					}),
					this.prisma.inventoryTransactionBarangMentah.groupBy({
						by: ['productId'],
						where: {
							productId: { in: productIds },
							transactionType: 'OUT',
							transactionDate: { lte: endDate },
							deletedAt: null,
						},
						_sum: {
							quantity: true,
						},
					}),
					// Hanya untuk mempertahankan field averageCost
					// yang sudah digunakan frontend. Harga ini adalah
					// harga rata-rata terkini, bukan harga historis.
					this.prisma.stockSummaryBarangMentah.findMany({
						where: {
							productId: { in: productIds },
						},
						select: {
							productId: true,
							averageCost: true,
						},
					}),
				]);

				const masukMap = new Map(stokMasuk.map((item) => [item.productId, item._sum.quantity ?? 0]));

				const keluarMap = new Map(stokKeluar.map((item) => [item.productId, item._sum.quantity ?? 0]));

				const averageCostMap = new Map(stockSummaries.map((item) => [item.productId, item.averageCost]));

				for (const productId of productIds) {
					const masuk = masukMap.get(productId) ?? 0;
					const keluar = keluarMap.get(productId) ?? 0;

					stockMap.set(productId, {
						stock: masuk - keluar,
						averageCost: averageCostMap.get(productId) ?? 0,
					});
				}
			}
		} else {
			// Tanpa filter periode, pertahankan perilaku lama:
			// stok dan harga rata-rata dari ringkasan terkini.
			const stockSummaries =
				productIds.length > 0
					? await this.prisma.stockSummaryBarangMentah.findMany({
							where: {
								productId: { in: productIds },
							},
							select: {
								productId: true,
								stock: true,
								averageCost: true,
							},
						})
					: [];

			for (const item of stockSummaries) {
				stockMap.set(item.productId, {
					stock: item.stock,
					averageCost: item.averageCost,
				});
			}
		}

		const results = data.map((item) => {
			const stock = stockMap.get(item.id);

			return {
				...item,
				stokterKiniAll: stock?.stock ?? 0,
				averageCost: stock?.averageCost ?? 0,
			};
		});

		return {
			data: results,
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: string) {
		return this.prisma.masterRawMaterial.findUnique({
			where: {
				id,
			},
		});
	}

	update(id: string, updateBarangMentahDto: UpdateBarangMentahDto) {
		return this.prisma.masterRawMaterial.update({
			where: {
				id,
			},
			data: {
				accountCode: updateBarangMentahDto.accountCode,
				itemCode: updateBarangMentahDto.itemCode,
				itemName: updateBarangMentahDto.itemName,
				unitId: updateBarangMentahDto.unitId,
				satuan: updateBarangMentahDto.satuan,
			},
		});
	}

	remove(id: string) {
		return this.prisma.masterRawMaterial.update({
			where: {
				id,
			},
			data: {
				deletedAt: nowWIBString(),
			},
		});
	}

	async getAllBarangMentah(query: GetBarangMentahDto, decoded: DecodeTokenType) {
		const { page = 1, limit = 10, startDate, endDate } = query;
		const skip = (page - 1) * +limit;

		const unitFilter = !decoded.isPusat || decoded.isRoot != 'Y' ? { product: { unitId: decoded.unitId } } : {};

		const dateRangeFilter: any = {};
		if (startDate || endDate) {
			dateRangeFilter.transactionDate = {};
			if (startDate) {
				const start = new Date(startDate);
				start.setHours(0, 0, 0, 0);
				dateRangeFilter.transactionDate.gte = start;
			}
			if (endDate) {
				const end = new Date(endDate);
				end.setHours(23, 59, 59, 999);
				dateRangeFilter.transactionDate.lte = end;
			}
		}

		//Parallel: ambil data + total count sekaligus
		const [productsWithStock, total] = await Promise.all([
			this.prisma.stockSummaryBarangMentah.findMany({
				skip,
				take: +limit,
				where: unitFilter,
				orderBy: { updatedAt: 'desc' },
				include: { product: { include: { unit: true } } },
			}),
			this.prisma.stockSummaryBarangMentah.count({ where: unitFilter }),
		]);

		const allProductIds = productsWithStock.map((e) => e.productId);

		//Hanya 2 query untuk semua produk
		const [stokMasukAll, stokKeluarAll] = await Promise.all([
			this.prisma.inventoryTransactionBarangMentah.groupBy({
				by: ['productId'],
				_sum: { quantity: true },
				where: { productId: { in: allProductIds }, transactionType: 'IN', ...dateRangeFilter },
			}),
			this.prisma.inventoryTransactionBarangMentah.groupBy({
				by: ['productId'],
				_sum: { quantity: true },
				where: { productId: { in: allProductIds }, transactionType: 'OUT', ...dateRangeFilter },
			}),
		]);

		const masukMap = new Map(stokMasukAll.map((s) => [s.productId, s._sum.quantity ?? 0]));
		const keluarMap = new Map(stokKeluarAll.map((s) => [s.productId, s._sum.quantity ?? 0]));

		const results = productsWithStock.map((entry) => ({
			...entry.product,
			stokTerkini: (masukMap.get(entry.productId) ?? 0) - (keluarMap.get(entry.productId) ?? 0),
			stokterKiniAll: entry.stock,
			averageCost: entry.averageCost,
		}));

		return {
			data: results,
			total,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(total / +limit),
		};
	}
}
