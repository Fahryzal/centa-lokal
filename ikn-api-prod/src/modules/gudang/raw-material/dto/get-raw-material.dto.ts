import { ApiPropertyOptional } from '@nestjs/swagger';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetMaterialDto {
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

	@ApiPropertyOptional({ description: 'documentNumber' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	documentNumber?: string;

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
	documentNo?: string;

	@ApiPropertyOptional({ description: 'date' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Date)
	@IsDate()
	date?: Date;

	@ApiPropertyOptional({ description: 'supplier' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	supplier?: string;

	@ApiPropertyOptional({ description: 'isLunas' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	isLunas?: string;

	@ApiPropertyOptional({ description: 'itemCode' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	itemCode?: string;

	@ApiPropertyOptional({ description: 'itemName' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	itemName?: string;

	@ApiPropertyOptional({ description: 'startDate' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Date)
	@IsDate()
	startDate?: Date;
	@ApiPropertyOptional({ description: 'endDate' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Date)
	@IsDate()
	endDate?: Date;
}
