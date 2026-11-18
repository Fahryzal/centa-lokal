import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class GetSupplierDto {
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

	@ApiPropertyOptional({ description: 'Sort by', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortBy?: string;

	@ApiPropertyOptional({ description: 'Nama ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortOrder?: string;

	@ApiPropertyOptional({ description: 'nomorPengenal ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	nomorPengenal?: string;

	@ApiPropertyOptional({ description: 'alamatRekanan ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	namaRekanan?: string;

	@ApiPropertyOptional({ description: 'alamatRekanan ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	alamatRekanan?: string;

	@ApiPropertyOptional({ description: 'accountCode ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	accountCode?: string;
}
