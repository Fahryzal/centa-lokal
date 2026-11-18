import { Injectable, Scope, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { GetRolesDto } from './dto/get-roles.dto';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
@Injectable({ scope: Scope.REQUEST })
export class RolesService {
	constructor(private readonly prisma: PrismaService) {}
	async create(createRoleDto: CreateRoleDto) {
		return this.prisma.$transaction(async (tx) => {
			const lastRole = await tx.role.count();
			const newId = lastRole + 1;
			await tx.role.create({
				data: {
					name: createRoleDto.name,
					id: newId,
					permissions: {
						create: createRoleDto.rolePermission.map((items) => ({
							canAdd: items.canAdd,
							canApprove: items.canApprove,
							canDelete: items.canDelete,
							canEdit: items.canEdit,
							canView: items.canView,
							menuId: items.menuId,
						})),
					},
				},
			});
		});
	}

	async findAll(query: GetRolesDto) {
		const { page = 1, limit = 10, name } = query;
		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (name) {
			whereCondition.name = {
				contains: name,
				mode: 'insensitive',
			};
		}
		const [data, total] = await this.prisma.$transaction([
			this.prisma.role.findMany({
				skip,
				take,
				where: whereCondition,
				include: {
					permissions: {
						include: {
							menu: true,
						},
					},
				},
			}),
			this.prisma.role.count({ where: whereCondition }),
		]);

		return {
			data,
			total,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(total / +limit),
		};
	}

	findOne(id: number) {
		return this.prisma.role.findUnique({
			include: {
				permissions: {
					include: {
						menu: true,
					},
				},
			},
			where: {
				id,
			},
		});
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		return this.prisma.$transaction(async (tx) => {
			const role = await tx.role.findUnique({
				where: { id },
			});

			if (!role) {
				throw new NotFoundException(`Role #${id} not found`);
			}

			// Update role name if provided
			if (updateRoleDto.name) {
				await tx.role.update({
					where: { id },
					data: { name: updateRoleDto.name },
				});
			}

			// Update permissions if provided
			if (updateRoleDto.rolePermission) {
				// Delete existing permissions
				await tx.rolePermission.deleteMany({
					where: { roleId: id },
				});

				// Insert new permissions
				if (updateRoleDto.rolePermission.length > 0) {
					await tx.rolePermission.createMany({
						data: updateRoleDto.rolePermission.map((item) => ({
							roleId: id,
							menuId: item.menuId,
							canView: item.canView ?? false,
							canAdd: item.canAdd ?? false,
							canEdit: item.canEdit ?? false,
							canDelete: item.canDelete ?? false,
							canApprove: item.canApprove ?? false,
						})),
					});
				}
			}

			return tx.role.findUnique({
				where: { id },
				include: {
					permissions: {
						include: {
							menu: true,
						},
					},
				},
			});
		});
	}

	remove(id: number) {
		return this.prisma.role.update({
			where: {
				id,
			},
			data: {
				name: `${Math.random()}-deleted`,
				deletedAt: nowWIBString(),
			},
		});
	}
}
