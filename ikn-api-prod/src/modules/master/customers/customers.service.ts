import { Injectable } from '@nestjs/common';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomerDto } from './dto/get-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
	constructor(private readonly prisma: PrismaService) {}
	async create(createCustomerDto: CreateCustomerDto, decoded: DecodeTokenType) {
		return await this.prisma.customer.create({
			data: {
				name: createCustomerDto.name,
				code: createCustomerDto.code,
				address: createCustomerDto.address,
				unit: createCustomerDto.unit,
				email: createCustomerDto.email,
				phone: createCustomerDto.phone,
				regional_type: createCustomerDto.regional_type,
				country: createCustomerDto.country || '-',
				continent: createCustomerDto.continent || '-',
				staffId: decoded.id,
			},
		});
	}

	async findAll(query: GetCustomerDto) {
		const { page = 1, limit = 10, code, name, phone, address, email, continent, unit, country, regional_type } = query;

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (code) {
			whereCondition.code = {
				contains: code,
				mode: 'insensitive',
			};
		}

		if (name) {
			whereCondition.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (phone) {
			whereCondition.phone = {
				contains: phone,
				mode: 'insensitive',
			};
		}

		if (address) {
			whereCondition.address = {
				contains: address,
				mode: 'insensitive',
			};
		}
		if (email) {
			whereCondition.email = {
				contains: email,
				mode: 'insensitive',
			};
		}

		if (continent) {
			whereCondition.continent = {
				contains: continent,
				mode: 'insensitive',
			};
		}

		if (unit) {
			whereCondition.unit = unit;
		}

		if (country) {
			whereCondition.country = {
				contains: country,
				mode: 'insensitive',
			};
		}

		if (regional_type) {
			whereCondition.regional_type = {
				contains: regional_type,
				mode: 'insensitive',
			};
		}

		const [data, total] = await this.prisma.$transaction([
			this.prisma.customer.findMany({
				skip,
				take,
				where: whereCondition,
			}),
			this.prisma.customer.count({ where: whereCondition }),
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
		return await this.prisma.customer.findUnique({
			where: { id },
		});
	}

	async update(id: string, updateCustomerDto: UpdateCustomerDto) {
		return await this.prisma.customer.update({
			where: { id },
			data: {
				name: updateCustomerDto.name,
				code: updateCustomerDto.code,
				address: updateCustomerDto.address,
				unit: updateCustomerDto.unit,
				email: updateCustomerDto.email,
				phone: updateCustomerDto.phone,
				regional_type: updateCustomerDto.regional_type,
				country: updateCustomerDto.country || '-',
				continent: updateCustomerDto.continent || '-',
			},
		});
	}

	async remove(id: string) {
		return this.prisma.customer.update({
			where: {
				id,
			},
			data: {
				deletedAt: nowWIBString(),
			},
		});
	}

	async restore(id: string) {
		return await this.prisma.customer.update({
			where: { id },
			data: { deletedAt: null },
		});
	}
}
