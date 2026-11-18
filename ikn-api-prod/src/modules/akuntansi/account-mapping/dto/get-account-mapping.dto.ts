import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Module, TransactionType, TransactionTypeMapping } from '@prisma/client';

export class GetAccountMappingDto {
	@ApiPropertyOptional({ description: 'Current page', example: 1 })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	page?: number = 1;

	@ApiPropertyOptional({ description: 'Limit page', example: 10 })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	limit?: number = 10;

	@ApiPropertyOptional({ description: 'module' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	module?: Module;

	@ApiPropertyOptional({ description: 'transactionType' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	transactionType?: TransactionTypeMapping;

	@ApiPropertyOptional({ description: 'posisition' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	posisition?: string;

	@ApiPropertyOptional({ description: 'posisition' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	usage?: string;
}
