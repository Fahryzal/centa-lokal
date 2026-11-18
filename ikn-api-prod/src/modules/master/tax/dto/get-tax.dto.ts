import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TypeTax } from '@prisma/client';

export class GetTaxDto {
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

	@ApiPropertyOptional({ description: 'taxType', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	taxType?: string;

	@ApiPropertyOptional({ description: 'taxValue', example: '' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	taxValue?: number;

	@IsOptional()
	@Type(() => String)
	@IsString()
	accountCode?: string;

	@IsOptional()
	@Type(() => String)
	@IsString()
	type: TypeTax;
}
