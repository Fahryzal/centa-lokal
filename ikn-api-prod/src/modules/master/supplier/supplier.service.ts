import { Injectable, Scope } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { GetSupplierDto } from './dto/get-supplier.dto';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal
	) {}
	create(createSupplierDto: CreateSupplierDto) {
		return this.prisma.masterRekananBahanBaku.create({
			data: {
				nomorPengenal: createSupplierDto.nomorPengenal,
				namaRekanan: createSupplierDto.namaRekanan,
				alamatRekanan: createSupplierDto.alamatRekanan,
				accountCode: createSupplierDto.accountCode,
				code: createSupplierDto.code,
			},
		});
	}

	async findAll(query: GetSupplierDto) {
		const { page = 1, limit = 10, sortBy, sortOrder, alamatRekanan, namaRekanan, nomorPengenal, accountCode } = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (alamatRekanan) {
			whereCondition.alamatRekanan = {
				contains: alamatRekanan,
				mode: 'insensitive',
			};
		}

		if (namaRekanan) {
			whereCondition.namaRekanan = {
				contains: namaRekanan,
				mode: 'insensitive',
			};
		}

		if (nomorPengenal) {
			whereCondition.nomorPengenal = {
				contains: nomorPengenal,
				mode: 'insensitive',
			};
		}

		if (accountCode) {
			whereCondition.accountCode = {
				contains: accountCode,
				mode: 'insensitive',
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.masterRekananBahanBaku.findMany({
				skip,
				take,
				where: whereCondition,
				include: {
					account: true,
				},
				orderBy: orderBy ?? { createdAt: 'desc' }, // fallback default
			}),
			this.prisma.masterRekananBahanBaku.count({ where: whereCondition }),
		]);

		return {
			data,
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: string) {
		return this.prisma.masterRekananBahanBaku.findUnique({
			where: {
				id,
			},
		});
	}

	update(id: string, updateSupplierDto: UpdateSupplierDto) {
		return this.prisma.masterRekananBahanBaku.update({
			where: { id },
			data: {
				namaRekanan: updateSupplierDto.namaRekanan,
				alamatRekanan: updateSupplierDto.alamatRekanan,
				accountCode: updateSupplierDto.accountCode,
				code: updateSupplierDto.code,
			},
		});
	}

	remove(id: string) {
		const uuid = crypto.randomUUID();
		return this.prisma.masterRekananBahanBaku.update({
			where: { id },
			data: {
				nomorPengenal: uuid,
				deletedAt: nowWIBString(),
			},
		});
	}
}
