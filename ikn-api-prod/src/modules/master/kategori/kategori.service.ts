import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { Injectable, Scope } from '@nestjs/common';
import { GetKategoriDto } from './dto/get-kategori.dto';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';

@Injectable({ scope: Scope.REQUEST })
export class KategoriService {
	constructor(private readonly prisma: PrismaService) {}
	async create(createKategoriDto: CreateKategoriDto, decoded: DecodeTokenType) {
		return await this.prisma.masterKategoriBarangJadi.create({
			data: {
				kode: createKategoriDto.kode,
				nama: createKategoriDto.nama,
				staffId: decoded.id,
			},
		});
	}

	async findAll(query: GetKategoriDto) {
		const { page = 1, limit = 10, nama, kode } = query;

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (nama) {
			whereCondition.nama = {
				contains: nama,
				mode: 'insensitive',
			};
		}

		if (kode) {
			whereCondition.kode = {
				contains: kode,
				mode: 'insensitive',
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.masterKategoriBarangJadi.findMany({
				skip,
				take,
				where: whereCondition,
			}),
			this.prisma.masterKategoriBarangJadi.count({ where: whereCondition }),
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
		return await this.prisma.masterKategoriBarangJadi.findUnique({
			where: {
				id,
			},
		});
	}

	async update(id: string, updateKategoriDto: UpdateKategoriDto) {
		return await this.prisma.masterKategoriBarangJadi.update({
			where: {
				id,
			},
			data: {
				nama: updateKategoriDto.nama,
			},
		});
	}

	async remove(id: string) {
		const uuid = crypto.randomUUID();
		return await this.prisma.masterKategoriBarangJadi.update({
			where: { id },
			data: {
				kode: uuid,
				deletedAt: nowWIBString(),
			}, // Menandai sebagai terhapus
		});
	}

	async restore(id: string) {
		return await this.prisma.masterKategoriBarangJadi.update({
			where: { id },
			data: { deletedAt: null },
		});
	}
}
