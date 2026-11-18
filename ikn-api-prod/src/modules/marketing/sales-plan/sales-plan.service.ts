import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from '@shared/types/custom-request';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
import { CreateSalesPlanDto } from './dto/create-sales-plan.dto';
import { GetSalesPlanDto } from './dto/get-sales-plan.dto';
import { UpdateSalesPlanDto } from './dto/update-sales-plan.dto';

@Injectable({ scope: Scope.REQUEST })
export class SalesPlanService {
	constructor(
		@Inject(REQUEST) private readonly req: CustomRequest,
		private readonly prisma: PrismaService,
	) {}
	async create(createSalesPlanDto: CreateSalesPlanDto, decoded: DecodeTokenType) {
		const salesPlan = await this.prisma.salesPlan.create({
			data: {
				description: createSalesPlanDto.description,
				date: nowWIBString(),
				staffId: decoded.id,
				value_rkap: +createSalesPlanDto.value_rkap,
				unitId: createSalesPlanDto.unitId,
				periode_month: createSalesPlanDto.periode_month,
				typeSalesPlan: createSalesPlanDto.typeSalesPlan,
			},
		});
		return salesPlan;
	}

	async findAll(query: GetSalesPlanDto, dataToken: DecodeTokenType) {
		const { page = 1, limit = 10, date, description, value_rkap, periode_month, unit, status, typeSalesPlan } = query;

		const skip = (page - 1) * limit;
		const take = +limit;
		const parsedDate = date ? new Date(date) : null;

		if (parsedDate && isNaN(parsedDate.getTime())) {
			throw new BadRequestException('Invalid date format');
		}

		const whereCondition: any = {};

		if (dataToken.roles.some((item) => item === 'admin')) {
			whereCondition.staffId = dataToken.id;
		}

		if (date) {
			whereCondition.date = {
				gte: new Date(parsedDate.setUTCHours(0, 0, 0, 0)), // Mulai dari awal hari
				lte: new Date(parsedDate.setUTCHours(23, 59, 59, 999)), // Hingga akhir hari
			};
		}

		if (description) {
			whereCondition.description = {
				contains: description,
				mode: 'insensitive',
			};
		}

		if (value_rkap) {
			whereCondition.value_rkap = +value_rkap;
		}

		if (periode_month) {
			whereCondition.periode_month = {
				contains: periode_month,
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

		if (status) {
			whereCondition.status = {
				equals: status as UpdateSalesPlanDto, // Pastikan status sesuai dengan enum
			};
		}

		if (typeSalesPlan) {
			whereCondition.typeSalesPlan = typeSalesPlan;
		}

		const [data, total] = await this.prisma.$transaction([
			this.prisma.salesPlan.findMany({
				skip,
				take,
				include: {
					unit: true,
				},
				orderBy: {
					date: 'desc',
				},
				where: whereCondition,
			}),
			this.prisma.salesPlan.count({ where: whereCondition }),
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
		const salesPlan = await this.prisma.salesPlan.findUnique({
			where: {
				id,
			},
		});
		return salesPlan;
	}

	async update(id: string, updateSalesPlanDto: UpdateSalesPlanDto) {
		const salesPlan = await this.prisma.salesPlan.update({
			where: {
				id: id,
			},
			data: {
				value_rkap: +updateSalesPlanDto.value_rkap,
				periode_month: updateSalesPlanDto.periode_month,
				unitId: updateSalesPlanDto.unitId,
			},
		});
		return salesPlan;
	}

	async updateStatus(id: string, updateSalesPlanDto: UpdateSalesPlanDto) {
		const salesPlan = await this.prisma.salesPlan.update({
			where: {
				id: id,
			},
			data: {
				status: updateSalesPlanDto.status,
			},
		});
		return salesPlan;
	}

	async remove(id: string) {
		return this.prisma.salesPlan.update({
			where: {
				id,
			},
			data: {
				deletedAt: nowWIBString(),
			},
		});
	}

	async restore(id: string) {
		return await this.prisma.salesPlan.update({
			where: { id },
			data: { deletedAt: null },
		});
	}
}
