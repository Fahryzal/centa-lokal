import { Injectable, Scope } from '@nestjs/common';
import { CreateAkunTypeDto } from './dto/create-akun-type.dto';
import { UpdateAkunTypeDto } from './dto/update-akun-type.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { GetAkunTypeDto } from './dto/get-akun-type.dto';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
@Injectable({ scope: Scope.REQUEST })
export class AkunTypeService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal
	) {}
	create(createAkunTypeDto: CreateAkunTypeDto) {
		return this.prisma.accountType.create({
			data: createAkunTypeDto,
		});
	}

	async findAll(query: GetAkunTypeDto) {
		const { page = 1, limit = 10, sortBy, sortOrder, code, description, name, normalBalance } = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (code) {
			whereCondition.code = {
				contains: code,
				mode: 'insensitive',
			};
		}

		if (description) {
			whereCondition.description = {
				contains: description,
				mode: 'insensitive',
			};
		}

		if (name) {
			whereCondition.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (normalBalance) {
			whereCondition.normalBalance = normalBalance;
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.accountType.findMany({
				skip,
				take,
				where: whereCondition,
				orderBy: orderBy ?? { createdAt: 'desc' }, // fallback default
			}),
			this.prisma.accountType.count({ where: whereCondition }),
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
		return this.prisma.accountType.findUnique({
			where: {
				id,
			},
		});
	}

	update(id: string, updateAkunTypeDto: UpdateAkunTypeDto) {
		return this.prisma.accountType.update({
			where: {
				id,
			},
			data: updateAkunTypeDto,
		});
	}

	remove(id: string) {
		const uuid = crypto.randomUUID();
		return this.prisma.accountType.update({
			where: {
				id,
			},
			data: {
				name: uuid,
				code: uuid,
				deletedAt: nowWIBString(),
			},
		});
	}
}
