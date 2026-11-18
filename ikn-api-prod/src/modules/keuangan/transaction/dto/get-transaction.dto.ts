import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, TypePenjualan } from '@prisma/client';

export class GetTransactionDto {
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

	@ApiPropertyOptional({ description: 'amountInIDR' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	amountInIDR?: number;

	@ApiPropertyOptional({ description: 'grossAmount' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	grossAmount?: number;

	@ApiPropertyOptional({ description: 'transactionNumber' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	transactionNumber: string;

	@ApiPropertyOptional({ description: 'type', example: 'INCOME | EXPENSIVE' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	type: TransactionType;

	@ApiPropertyOptional({ description: 'type' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typeTransaction?: TypePenjualan;

	@ApiPropertyOptional({ description: 'description' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	description: string;

	@ApiPropertyOptional({ description: 'date' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	date: string;

	@ApiPropertyOptional({ description: 'isMaterial' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	isMaterial: string;

	@ApiPropertyOptional({ description: 'invoiceNumber' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	invoiceNumber: string;

	@ApiPropertyOptional({ description: 'isNotEkspor' })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	isNotEkspor: boolean;
}
