import { Injectable, Scope } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { GetMenuDto } from './dto/get-menu.dto';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { uuID } from '@src/common/utils/helper/generator.helper';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';

@Injectable({ scope: Scope.REQUEST })
export class MenusService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal
	) {}
	create(createMenuDto: CreateMenuDto) {
		return this.prisma.menu.create({
			data: createMenuDto,
		});
	}

	async findAll(query: GetMenuDto) {
		const { page = 1, limit = 10, name, parentId, path, sortBy, sortOrder } = query;
		const skip = (page - 1) * limit;
		const take = +limit;
		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const whereCondition: any = {};
		if (name) {
			whereCondition.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (path) {
			whereCondition.path = {
				contains: path,
				mode: 'insensitive',
			};
		}

		if (parentId) {
			whereCondition.parentId = parentId;
		}

		const [data, total] = await this.prisma.$transaction([
			this.prisma.menu.findMany({
				skip,
				take,
				where: whereCondition,
				orderBy: orderBy ?? { createdAt: 'desc' }, // fallback default
			}),
			this.prisma.menu.count({ where: whereCondition }),
		]);

		return {
			data,
			total,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(total / +limit),
		};
	}

	async findAllByGroup() {
		const parentMenus = await this.prisma.menu.findMany({
			where: {
				parentId: null,
				deletedAt: null,
			},
			include: {
				children: {
					where: { deletedAt: null },
				},
			},
		});

		return parentMenus;
	}

	findOne(id: number) {
		return this.prisma.menu.findUnique({
			where: {
				id: id,
			},
		});
	}

	update(id: number, updateMenuDto: UpdateMenuDto) {
		return this.prisma.menu.update({
			data: updateMenuDto,
			where: {
				id,
			},
		});
	}

	remove(id: number) {
		return this.prisma.menu.update({
			data: {
				name: uuID(),
				path: uuID(),
				deletedAt: nowWIBString(),
			},
			where: {
				id,
			},
		});
	}
}
