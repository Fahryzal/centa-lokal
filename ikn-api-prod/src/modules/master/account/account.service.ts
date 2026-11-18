import { Injectable, Scope } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { GetAccountDto } from './dto/get-account.dto';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';

@Injectable({ scope: Scope.REQUEST })
export class AccountService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal
	) {}
	// https://chatgpt.com/c/683ef320-131c-8006-8ff1-7e634830f45f

	async create(createAccountDto: CreateAccountDto, decoded: DecodeTokenType) {
		return this.prisma.account.create({
			data: {
				code: createAccountDto.code,
				name: createAccountDto.name,
				parentId: createAccountDto.parentId,
				accountTypeId: createAccountDto.accountTypeId,
				staffId: decoded.id,
				typeNeraca: createAccountDto.typeNeraca,
				parentName: createAccountDto.parentName,
				isLocked: createAccountDto.isLocked,
			},
		});
	}

	async findAll(query: GetAccountDto) {
		const {
			page = 1,
			limit = 100,
			sortBy,
			sortOrder,
			code,
			id,
			name,
			accountType,
			typeNeraca,
			parentName,
			isLocked,
		} = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const skip = (page - 1) * limit;
		const take = +limit;
		let whereCondition: any = {};

		if (name) {
			whereCondition.name = {
				contains: name,
				mode: 'insensitive',
			};
		}

		if (isLocked) {
			whereCondition.isLocked = isLocked;
		}

		if (parentName) {
			whereCondition.parentName = {
				contains: parentName,
				mode: 'insensitive',
			};
		}

		if (typeNeraca) {
			whereCondition.typeNeraca = {
				contains: typeNeraca,
				mode: 'insensitive',
			};
		}

		if (code) {
			whereCondition.code = {
				contains: code,
				mode: 'insensitive',
			};
		}

		if (id) {
			whereCondition.id = {
				contains: id,
				mode: 'insensitive',
			};
		}

		if (accountType) {
			whereCondition = {
				...whereCondition,
				accountType: {
					name: accountType,
				},
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.account.findMany({
				skip,
				take,
				where: whereCondition,
				include: {
					accountType: true,
				},
				orderBy: orderBy ?? { code: 'asc' }, // fallback default
			}),
			this.prisma.account.count({ where: whereCondition }),
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
		return this.prisma.account.findUnique({
			where: {
				id,
			},
		});
	}

	update(id: string, updateAccountDto: UpdateAccountDto, decoded: DecodeTokenType) {
		return this.prisma.account.update({
			where: {
				id,
			},
			data: {
				code: updateAccountDto.code,
				name: updateAccountDto.name,
				parentId: updateAccountDto.parentId,
				accountTypeId: updateAccountDto.accountTypeId,
				staffId: decoded.id,
				parentName: updateAccountDto.parentName,
				typeNeraca: updateAccountDto.typeNeraca,
				isLocked: updateAccountDto.isLocked,
			},
		});
	}

	remove(id: string) {
		return this.prisma.account.update({
			where: {
				id,
			},
			data: {
				deletedAt: nowWIBString(),
			},
		});
	}
}
