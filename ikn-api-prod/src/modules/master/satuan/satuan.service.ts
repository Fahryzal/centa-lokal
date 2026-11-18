import { Injectable, Scope } from '@nestjs/common';
import { CreateSatuanDto } from './dto/create-satuan.dto';
import { UpdateSatuanDto } from './dto/update-satuan.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { GetSatuantDto } from './dto/get-satuan.dto';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';

@Injectable({ scope: Scope.REQUEST })
export class SatuanService {
	constructor(private readonly prisma: PrismaService) {}
	async create(createSatuanDto: CreateSatuanDto, decoded: DecodeTokenType) {
		return await this.prisma.masterSatuan.create({
			data: {
				kode: createSatuanDto.kode,
				name: createSatuanDto.name,
				keterangan: createSatuanDto.keterangan,
				staffId: decoded.id,
			},
		});
	}

	async findAll(query: GetSatuantDto) {
		const { page = 1, limit = 10, keterangan, kode, name } = query;

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (keterangan) {
			whereCondition.keterangan = {
				contains: keterangan,
				mode: 'insensitive',
			};
		}

		if (name) {
			whereCondition.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (kode) {
			whereCondition.kode = {
				contains: kode,
				mode: 'insensitive',
			};
		}

		const [data, total] = await this.prisma.$transaction([
			this.prisma.masterSatuan.findMany({
				skip,
				take,
				where: whereCondition,
			}),
			this.prisma.masterSatuan.count({ where: whereCondition }),
		]);

		return {
			data,
			total,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(total / +limit),
		};
	}

	async findOne(id: string) {
		return await this.prisma.masterSatuan.findUnique({
			where: {
				id,
			},
		});
	}

	async update(id: string, updateSatuanDto: UpdateSatuanDto) {
		return await this.prisma.masterSatuan.update({
			where: {
				id,
			},
			data: {
				keterangan: updateSatuanDto.keterangan,
				name: updateSatuanDto.name,
			},
		});
	}

	async remove(id: string) {
		const uuid = crypto.randomUUID();

		return await this.prisma.masterSatuan.update({
			where: { id },
			data: {
				kode: uuid,
				deletedAt: nowWIBString(),
			}, // Menandai sebagai terhapus
		});
	}

	async restore(id: string) {
		return await this.prisma.masterSatuan.update({
			where: { id },
			data: { deletedAt: null },
		});
	}
}
