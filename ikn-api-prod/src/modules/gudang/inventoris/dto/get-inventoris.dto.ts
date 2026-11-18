import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetInventorisDto {
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

	@ApiPropertyOptional({ description: 'documentCode' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	documentCode?: string;

	@ApiPropertyOptional({ description: 'documentNumber' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	documentNumber?: string;

	@ApiPropertyOptional({ description: 'date' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Date)
	@IsDate()
	date?: Date;

	@ApiPropertyOptional({ description: 'unit' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	unit?: string;
}

export class GetKartuGudangProductDto {
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

	@ApiPropertyOptional({ description: 'year' })
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	year?: number;
}
