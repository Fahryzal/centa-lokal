import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CustomRequest } from '@shared/types/custom-request';
import { GetRolesDto, GetUsertDto } from './dto/get-user.dto';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
	constructor(
		@Inject(REQUEST) private readonly req: CustomRequest,
		private readonly prisma: PrismaService
	) {}

	async create(createUserDto: CreateUserDto) {
		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
		// Buat user baru
		return await this.prisma.user.create({
			data: {
				email: createUserDto.email,
				password: hashedPassword,
				name: createUserDto.name,
				jabatan: createUserDto.jabatan,
				nik: createUserDto.nik,
				unitId: createUserDto.unitID,
				isPusat: createUserDto.isPusat,
				isRoot: createUserDto.isRoot,
				roles: {
					createMany: {
						data: createUserDto.roleIds.map((roleId) => ({ roleId })),
					},
				},
			},
			include: { roles: true },
		});
	}

	// Menambahkan Role ke User
	async createRoleToUser() {
		await this.prisma.userRole.create({
			data: {
				userId: 'user-uuid-123',
				roleId: 2, // Misal, roleId = 2 adalah "Admin"
			},
		});
	}

	// Mengambil Semua Role dari Seorang User
	async findRoleFromUser() {
		const user = await this.prisma.user.findUnique({
			where: { id: 'user-uuid-123' },
			include: { roles: { include: { role: true } } },
		});

		return user.roles.map((r) => r.role.name);
	}

	// Mengecek Apakah User Memiliki Role Tertentu
	async findCheckRoleUser() {
		const isAdmin = await this.prisma.userRole.findFirst({
			where: { userId: 'user-uuid-123', roleId: 2 },
		});

		if (isAdmin) {
			console.log('User ini adalah Admin');
		} else {
			console.log('User ini bukan Admin');
		}
	}

	// Menambahkan Permission ke Role
	// async createRolePermision() {
	// 	await this.prisma.rolePermission.create({
	// 		data: {
	// 			roleId: 2, // Admin
	// 			permissionId: 1, // manage_users
	// 		},
	// 	});
	// }

	// Mengecek Apakah User Memiliki Permission Tertentu
	async findPermisionUser() {
		const userHasPermission = await this.prisma.rolePermission.findFirst({
			where: {
				roleId: {
					in: (
						await this.prisma.userRole.findMany({
							where: { userId: 'user-uuid-123' },
							select: { roleId: true },
						})
					).map((r) => r.roleId),
				},
				// permission: { name: 'manage_users' },
			},
		});

		console.log(userHasPermission ? 'User punya izin' : 'User tidak punya izin');
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
			where: {
				email: email,
			},
		});
	}

	async findByUserName(username: string) {
		return this.prisma.user.findUnique({
			include: {
				roles: {
					include: {
						role: true,
					},
				},
			},
			where: {
				name: username,
			},
		});
	}

	async softDeleteUser(userId: string) {
		return this.prisma.user.update({
			where: { id: userId },
			data: { deletedAt: nowWIBString() }, // Menandai sebagai terhapus
		});
	}

	async restoreUser(userId: string) {
		return this.prisma.user.update({
			where: { id: userId },
			data: { deletedAt: null },
		});
	}

	async findAll(query: GetUsertDto) {
		const { page = 1, limit = 10, name, email, nik, jabatan, roles } = query;
		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (nik) {
			whereCondition.nik = {
				contains: nik,
				mode: 'insensitive',
			};
		}
		if (jabatan) {
			whereCondition.jabatan = {
				contains: jabatan,
				mode: 'insensitive',
			};
		}

		if (name) {
			whereCondition.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (email) {
			whereCondition.email = {
				contains: email,
				mode: 'insensitive',
			};
		}

		// dari deep join
		if (roles) {
			whereCondition.roles = {
				some: {
					role: {
						name: {
							contains: roles,
							mode: 'insensitive',
						},
					},
				},
			};
		}

		const [user, total] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				skip,
				take,
				where: whereCondition,
				select: {
					id: true,
					name: true,
					email: true,
					nik: true,
					jabatan: true,
					roles: {
						select: {
							role: {
								select: {
									name: true,
									permissions: true,
								},
							},
						},
					},
				},
			}),
			this.prisma.user.count({ where: whereCondition }),
		]);

		const data = user.map((item) => ({
			id: item.id,
			name: item.name,
			email: item.email,
			jabatan: item.jabatan,
			nik: item.nik,
			roles: item.roles.map((r) => r.role.name),
			permisions: item.roles && item.roles[0],
		}));

		return {
			data,
			total,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(total / +limit),
		};
	}

	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				nik: true,
				jabatan: true,
				unitId: true,
				isRoot: true,
				isPusat: true,
				// password: true,
				roles: {
					select: {
						role: {
							select: {
								name: true,
								id: true,
								// permissions: {
								// 	select: {
								// 		permission: {
								// 			select: { name: true },
								// 		},
								// 	},
								// },
							},
						},
					},
				},
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		// Transform format data
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			nik: user.nik,
			unitId: user.unitId,
			jabatan: user.jabatan,
			isRoot: user.isRoot,
			isPusat: user.isPusat,
			roles: user.roles.map((r) => r.role.id),
			// permisions: [...new Set(user.roles.flatMap((r) => r.role.permissions.map((p) => p.permission.name)))], // Hapus duplikat permission
		};
	}

	async findRole(query: GetRolesDto) {
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

	async findPermisionByIdRole(id: number) {
		const user = await this.prisma.role.findUnique({
			where: {
				id: id,
			},
			select: {
				name: true,
				permissions: {
					select: {
						// permission: {
						// 	select: { name: true },
						// },
					},
				},
			},
		});

		// return {
		// 	permisions: [...new Set(user.permissions.flatMap((p) => p.permission.name))],
		// };
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		let dataUpdate: any = {
			email: updateUserDto.email,
			jabatan: updateUserDto.jabatan,
			name: updateUserDto.name,
			nik: updateUserDto.nik,
			unitId: updateUserDto.unitID,
			isPusat: updateUserDto.isPusat,
			isRoot: updateUserDto.isRoot,
		};

		if (updateUserDto.password) {
			const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
			dataUpdate = {
				...dataUpdate,
				password: hashedPassword,
			};
		}

		const [user, _delRole, role] = await this.prisma.$transaction([
			this.prisma.user.update({
				where: { id },
				data: dataUpdate,
			}),
			this.prisma.userRole.deleteMany({
				where: { userId: id }, // Hapus semua role user lama
			}),
			this.prisma.userRole.createMany({
				data: updateUserDto.roleIds.map((roleId) => ({
					userId: id,
					roleId,
				})),
			}),
		]);
		return {
			...user,
			role,
		};
	}

	// users.service.ts

	async findByIdWithRoles(userId: string) {
		return this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				unit: true,
				roles: {
					include: {
						user: true,
						role: true,
					},
				},
			},
		});
	}
}
