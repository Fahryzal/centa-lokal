import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class GetAkunTypeDto {
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

	@ApiPropertyOptional({ description: 'code', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	code?: string;

	@ApiPropertyOptional({ description: 'name', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	name?: string;

	@ApiPropertyOptional({ description: 'normalBalance', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	normalBalance?: string;

	@ApiPropertyOptional({ description: 'normalBalance', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	description?: string;
}
