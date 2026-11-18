import { Injectable, Scope } from '@nestjs/common';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
import { CreateUnitDto } from './dto/create-unit.dto';
import { GetUnitDto } from './dto/get-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable({ scope: Scope.REQUEST })
export class UnitService {
	constructor(private readonly prisma: PrismaService) {}
	async create(createUnitDto: CreateUnitDto, decoded: DecodeTokenType) {
		return await this.prisma.masterUnit.create({
			data: {
				kode: createUnitDto.kode,
				nama: createUnitDto.nama,
			},
		});
	}

	async findAll(query: GetUnitDto, decoded: DecodeTokenType) {
		const { page = 1, limit = 10, nama, kode, isAll } = query;

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};
		if (!(decoded.isRoot === 'Y' || decoded.isPusat) && isAll !== 'Y') {
			whereCondition.id = decoded.unitId;
		}

		// Jika parameter `unit` ada, tambahkan filter `unit`
		if (nama) {
			whereCondition.nama = {
				contains: nama,
				mode: 'insensitive',
			};
		}

		// Jika parameter `kode` ada, tambahkan filter `kode`
		if (kode) {
			whereCondition.kode = {
				contains: kode,
				mode: 'insensitive',
			};
		}

		const [data, total] = await this.prisma.$transaction([
			this.prisma.masterUnit.findMany({
				skip,
				take,
				where: whereCondition,
			}),
			this.prisma.masterUnit.count({ where: whereCondition }),
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
		return await this.prisma.masterUnit.findUnique({
			where: {
				id,
			},
		});
	}

	async update(id: string, updateUnitDto: UpdateUnitDto) {
		return await this.prisma.masterUnit.update({
			where: {
				id,
			},
			data: {
				nama: updateUnitDto.nama,
			},
		});
	}

	async remove(id: string) {
		const uuid = crypto.randomUUID();
		return await this.prisma.masterUnit.update({
			where: { id },
			data: {
				kode: uuid,
				nama: uuid,
				deletedAt: nowWIBString(),
			}, // Menandai sebagai terhapus
		});
	}

	async restore(id: string) {
		return await this.prisma.masterUnit.update({
			where: { id },
			data: { deletedAt: null },
		});
	}
}
