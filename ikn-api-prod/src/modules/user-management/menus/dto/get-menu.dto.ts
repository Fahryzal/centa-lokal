import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SelectionStatus, StatusInvoice, TypePenjualan } from '@prisma/client';
export class GetMenuDto {
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

	@ApiPropertyOptional({ description: 'name', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ description: 'path', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	path?: string;

	@ApiPropertyOptional({ description: 'parentId', example: '' })
	@Type(() => Number)
	@IsOptional()
	@IsNumber()
	parentId?: number;
}
