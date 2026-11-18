import { Injectable, Scope } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { GetTaxDto } from './dto/get-tax.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
@Injectable({ scope: Scope.REQUEST })
export class TaxService {
	constructor(private readonly prisma: PrismaService) {}
	create(createTaxDto: CreateTaxDto) {
		return 'This action adds a new tax';
	}

	async findAll(query: GetTaxDto) {
		const { page = 1, limit = 10, taxType, taxValue } = query;

		const skip = (page - 1) * limit;
		const take = +limit;
		const whereCondition: any = {};

		if (taxType) {
			whereCondition.taxType = {
				contains: taxType,
				mode: 'insensitive',
			};
		}

		if (taxValue) {
			whereCondition.taxValue = +taxValue;
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.tax.findMany({
				skip,
				take,
				where: whereCondition,
			}),
			this.prisma.tax.count({ where: whereCondition }),
		]);

		return {
			data,
			page: +page,
			limit: +limit,
			totalData,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: number) {
		return `This action returns a #${id} tax`;
	}

	update(id: number, updateTaxDto: UpdateTaxDto) {
		return `This action updates a #${id} tax`;
	}

	remove(id: number) {
		return `This action removes a #${id} tax`;
	}
}
