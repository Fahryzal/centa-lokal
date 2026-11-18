import { Injectable, Scope } from '@nestjs/common';
import { CreateAccountMappingDto } from './dto/create-account-mapping.dto';
import { UpdateAccountMappingDto } from './dto/update-account-mapping.dto';
import { PrismaService } from '@src/modules/common/prisma.service';
import { GetAccountMappingDto } from './dto/get-account-mapping.dto';

@Injectable({ scope: Scope.REQUEST })
export class AccountMappingService {
	constructor(private readonly prisma: PrismaService) {}
	create(createAccountMappingDto: CreateAccountMappingDto) {
		return this.prisma.accountMapping.create({
			data: {
				module: createAccountMappingDto.module,
				position: createAccountMappingDto.position,
				transactionType: createAccountMappingDto.transactionType,
				usage: createAccountMappingDto.usage,
				accountCode: createAccountMappingDto.accountCode,
			},
		});
	}

	async findAll(query: GetAccountMappingDto) {
		const { page = 1, limit = 10, module, transactionType, posisition, usage } = query;
		const skip = (page - 1) * limit;
		const take = +limit;
		const whereCondition: any = {};

		if (module) {
			whereCondition.module = module;
		}

		if (transactionType) {
			whereCondition.transactionType = transactionType;
		}

		if (posisition) {
			whereCondition.posisition = {
				contains: posisition,
				mode: 'insensitive',
			};
		}

		if (usage) {
			whereCondition.usage = {
				contains: usage,
				mode: 'insensitive',
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.accountMapping.findMany({
				// skip,
				// take,
				// where: whereCondition,
			}),
			this.prisma.accountMapping.count(),
		]);

		type AccountMapping = {
			id: string;
			module: string;
			transactionType: string;
			position: string;
			usage: string;
			accountCode: string;
			deletedAt: string | null;
		};

		type GroupedData = {
			key: string;
			module: string;
			transactionType: string;
			children: AccountMapping[];
		};

		// setelah dapat `data`, lakukan grouping:
		const grouped = data.reduce((acc: GroupedData[], item) => {
			const key = `${item.module}-${item.transactionType}`;
			let group = acc.find((g) => g.key === key);

			if (!group) {
				group = {
					key,
					module: item.module,
					transactionType: item.transactionType,
					children: [],
				};
				acc.push(group);
			}

			group.children.push(item as any);
			return acc;
		}, []);

		return {
			data: grouped,
			page: +page,
			limit: +limit,
			totalData,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: number) {
		return `This action returns a #${id} accountMapping`;
	}

	update(id: string, updateAccountMappingDto: UpdateAccountMappingDto) {
		return this.prisma.accountMapping.update({ where: { id }, data: updateAccountMappingDto });
	}

	remove(id: string) {
		return this.prisma.accountMapping.delete({ where: { id } });
	}
}
