import { Injectable, Scope } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
import { CreateBarangJadiDto } from './dto/create-barang-jadi.dto';
import { GetBarangjadiWithStockDto } from './dto/get-barang-jadi.-with-stockdto';
import { GetBarangjadiDto } from './dto/get-barang-jadi.dto';
import { UpdateBarangJadiDto } from './dto/update-barang-jadi.dto';

@Injectable({ scope: Scope.REQUEST })
export class BarangJadiService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal,
	) {}
	async create(createBarangJadiDto: CreateBarangJadiDto, decoded: DecodeTokenType) {
		return this.prisma.masterBarangJadi.create({
			data: {
				kategori: createBarangJadiDto.kategori,
				kodeBarang: createBarangJadiDto.kodeBarang,
				namaBarang: createBarangJadiDto.namaBarang,
				satuan: createBarangJadiDto.satuan,
				// Unit: createBarangJadiDto.,
				nilaiSatuan: createBarangJadiDto.nilaiSatuan,
				staffId: decoded.id,
			},
		});
	}

	async findAll(query: GetBarangjadiDto) {
		const {
			page = 1,
			limit = 10,
			kodeBarang,
			kodeKategori,
			kodeSatuan,
			namaBarang,
			spesifikasi,
			berat,
			sortBy,
			sortOrder,
			satuanProduct,
			unitProduct,
			kategori,
		} = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (kodeBarang) {
			whereCondition.kodeBarang = {
				contains: kodeBarang,
				mode: 'insensitive',
			};
		}

		if (kodeKategori) {
			whereCondition.kodeKategori = {
				contains: kodeKategori,
				mode: 'insensitive',
			};
		}

		if (kodeSatuan) {
			whereCondition.kodeSatuan = {
				contains: kodeSatuan,
				mode: 'insensitive',
			};
		}

		if (namaBarang) {
			whereCondition.namaBarang = {
				contains: namaBarang,
				mode: 'insensitive',
			};
		}

		if (berat) {
			whereCondition.berat = +berat; // Berat biasanya angka, jadi langsung bandingkan
		}

		if (spesifikasi) {
			whereCondition.spesifikasi = {
				contains: spesifikasi,
				mode: 'insensitive',
			};
		}

		if (satuanProduct) {
			whereCondition.satuanProduct = {
				contains: satuanProduct,
				mode: 'insensitive',
			};
		}

		if (kategori) {
			whereCondition.kategori = {
				contains: kategori,
				mode: 'insensitive',
			};
		}

		if (unitProduct) {
			whereCondition.unitProduct = {
				contains: unitProduct,
				mode: 'insensitive',
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.masterBarangJadi.findMany({
				skip,
				take,
				where: whereCondition,
				orderBy: orderBy ?? { createdAt: 'desc' }, // fallback default
			}),
			this.prisma.masterBarangJadi.count({ where: whereCondition }),
		]);

		return {
			data,
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	async findOne(id: string) {
		return this.prisma.masterBarangJadi.findUnique({
			where: {
				id,
			},
		});
	}

	async update(id: string, updateBarangJadiDto: UpdateBarangJadiDto) {
		return await this.prisma.masterBarangJadi.update({
			where: {
				id,
			},
			data: {
				kodeBarang: updateBarangJadiDto.kodeBarang,
				kategori: updateBarangJadiDto.kategori,
				satuan: updateBarangJadiDto.satuan,
				namaBarang: updateBarangJadiDto.namaBarang,
				nilaiSatuan: updateBarangJadiDto.nilaiSatuan,
			},
		});
	}

	async remove(id: string) {
		const uuid = crypto.randomUUID();
		return this.prisma.masterBarangJadi.update({
			where: {
				id,
			},
			data: {
				kodeBarang: uuid,
				deletedAt: nowWIBString(),
			},
		});
	}

	async restore(id: string) {
		return await this.prisma.masterBarangJadi.update({
			where: { id },
			data: { deletedAt: null },
		});
	}

	async getAllBarangJadi(query: GetBarangjadiWithStockDto, decoded: DecodeTokenType) {
		const {
			page = 1,
			limit = 10,
			sortBy = 'createdAt',
			sortOrder = 'desc',
			kodeBarang,
			namaBarang,
			kategori,
			spesifikasi,
			startDate,
			endDate,
		} = query;

		const offset = (page - 1) * +limit;
		const take = +limit;

		// 1. Build WHERE Clause
		const conditions: string[] = [`pri."deletedAt" IS NULL`, `pri."productionIssueId" IS NULL`];
		const values: any[] = [];

		// if (unit) {
		// 	values.push(`%${unit}%`);
		// 	conditions.push(`mu."nama" ILIKE $${values.length}`);
		// }

		if (!(decoded.isRoot === 'Y' || decoded.isPusat)) {
			values.push(decoded.unitId);
			conditions.push(`pri."unitId" = $${values.length}`);
		}

		if (kodeBarang) {
			values.push(`%${kodeBarang}%`);
			conditions.push(`pri."kodeBarang" ILIKE $${values.length}`);
		}

		if (namaBarang) {
			values.push(`%${namaBarang}%`);
			conditions.push(`pri."namaBarang" ILIKE $${values.length}`);
		}

		if (kategori) {
			values.push(`%${kategori}%`);
			conditions.push(`pri."kategori" ILIKE $${values.length}`);
		}
		// if (Satuan) {
		// 	values.push(`%${Satuan}%`);
		// 	conditions.push(`pri."Satuan" ILIKE $${values.length}`);
		// }
		// if (Total) {
		// 	values.push(Number(Total));
		// 	conditions.push(`pri."Total" = $${values.length}`);
		// }
		// if (nilaiSatuan) {
		// 	values.push(Number(nilaiSatuan));
		// 	conditions.push(`pri."nilaiSatuan" = $${values.length}`);
		// }
		// if (quantity) {
		// 	values.push(Number(quantity));
		// 	conditions.push(`pri."quantity" = $${values.length}`);
		// }
		// if (stok) {
		// 	values.push(Number(stok));
		// 	conditions.push(`pri."stok" = $${values.length}`);
		// }

		let start: Date | undefined;
		let end: Date | undefined;

		if (startDate) {
			start = new Date(startDate);
			start.setHours(0, 0, 0, 0);
			values.push(start);
			conditions.push(`pri."createdAt" >= $${values.length}`);
		}

		if (endDate) {
			end = new Date(endDate);
			end.setHours(23, 59, 59, 999);
			values.push(end);
			conditions.push(`pri."createdAt" <= $${values.length}`);
		}

		const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

		// 2. Whitelist untuk sorting
		const allowedSortFields = ['createdAt', 'stok', 'nilaiSatuan'];
		const safeSortBy = allowedSortFields.includes(sortBy) ? `pri."${sortBy}"` : `pri."createdAt"`;
		const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

		// 3. Query data utama
		const querySql = `
		SELECT DISTINCT ON (pri."finishedGoodId", pri."unitId")
			pri.*, mu."nama" AS "unitNama"
		FROM "ProductionReceiptItem" pri
		JOIN "MasterUnit" mu ON mu.id = pri."unitId"
		${whereClause}
		ORDER BY pri."finishedGoodId", pri."unitId", ${safeSortBy} ${safeSortOrder}
		OFFSET ${offset}
		LIMIT ${take};
		`;

		// 4. Query total count untuk pagination
		const countSql = `
		SELECT COUNT(*) AS total
		FROM (
			SELECT DISTINCT ON (pri."finishedGoodId", pri."unitId") 1
			FROM "ProductionReceiptItem" pri
			JOIN "MasterUnit" mu ON mu.id = pri."unitId"
			${whereClause}
			ORDER BY pri."finishedGoodId", pri."unitId", ${safeSortBy} ${safeSortOrder}
		) AS sub;
		`;

		const [data, totalResult] = await this.prisma.$transaction([
			this.prisma.$queryRawUnsafe(querySql, ...values) as any,
			this.prisma.$queryRawUnsafe(countSql, ...values),
		]);

		const totalData = parseInt(totalResult[0]?.total || '0', 10);

		const dateFilter: any = {};
		if (start || end) {
			dateFilter.createdAt = {};
			if (start) dateFilter.createdAt.gte = start;
			if (end) dateFilter.createdAt.lte = end;
		}

		const productsWithStock = await Promise.all(
			data.map(async (product) => {
				const stokMasuk = await this.prisma.inventoryTransaction.aggregate({
					_sum: {
						quantity: true,
						nilaiSatuan: true,
					},
					where: {
						productId: product.finishedGoodId,
						transactionType: 'IN',
						unit: product.unit,
						...dateFilter,
					},
				});

				const stokKeluar = await this.prisma.inventoryTransaction.aggregate({
					_sum: {
						quantity: true,
					},
					where: {
						productId: product.finishedGoodId,
						transactionType: 'OUT',
						unit: product.unit,
						...dateFilter,
					},
				});

				const stokTerkini = (stokMasuk._sum.quantity ?? 0) - (stokKeluar._sum.quantity ?? 0);

				return {
					...product,
					stokTerkini,
				};
			}),
		);

		return {
			data: productsWithStock,
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}
}
