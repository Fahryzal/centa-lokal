import { Injectable, Scope } from '@nestjs/common';
import { CreateTaxMasterDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { GetTaxDto } from './dto/get-tax.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { Prisma } from '@prisma/client';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
@Injectable({ scope: Scope.REQUEST })
export class TaxService {
	constructor(private readonly prisma: PrismaService) {}
	create(createTaxDto: CreateTaxMasterDto, decoded: DecodeTokenType) {
		return this.prisma.tax.create({
			data: {
				taxType: createTaxDto.taxtType,
				taxValue: +createTaxDto.taxValue,
				status: 'VERIFIED',
				type: createTaxDto.type,
				isActive: true,
				staffId: decoded.id,
				accountCode: createTaxDto.accountCode,
				namaAccount: createTaxDto.namaAccount,
			} as Prisma.TaxUncheckedCreateInput,
		});
	}

	async findAll(query: GetTaxDto) {
		const { page = 1, limit = 10, taxType, taxValue, accountCode, type } = query;

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

		if (accountCode) {
			whereCondition.accountCode = {
				contains: accountCode,
				mode: 'insensitive',
			};
		}

		if (type) {
			whereCondition.type = type;
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

	findOne(id: string) {
		return this.prisma.tax.findUnique({
			where: {
				id,
			},
		});
	}

	update(id: string, updateTaxDto: UpdateTaxDto, decoded: DecodeTokenType) {
		return this.prisma.tax.update({
			where: {
				id,
			},
			data: {
				taxType: updateTaxDto.taxtType,
				taxValue: +updateTaxDto.taxValue,
				status: 'VERIFIED',
				type: updateTaxDto.type,
				isActive: true,
				staffId: decoded.id,
				accountCode: updateTaxDto.accountCode,
				namaAccount: updateTaxDto.namaAccount,
			} as Prisma.TaxUncheckedCreateInput,
		});
	}

	remove(id: string) {
		return this.prisma.tax.update({
			where: {
				id,
			},
			data: {
				deletedAt: nowWIBString(),
			},
		});
	}
}
