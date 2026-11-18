import { ApiPropertyOptional } from '@nestjs/swagger';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetBarangMentahDto {
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

	@ApiPropertyOptional({ description: 'itemCode', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	itemCode?: string;

	@ApiPropertyOptional({ description: 'itemName', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	itemName?: string;

	@ApiPropertyOptional({ description: 'unit', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unit?: string;

	@ApiPropertyOptional({ description: 'unitId', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId?: string;

	@ApiPropertyOptional({ description: 'satuan', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	satuan?: string;

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

	@ApiPropertyOptional({ description: 'accountCode ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	accountCode: string;

	@ApiPropertyOptional({ description: 'account ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	account: string;

	@ApiPropertyOptional({ description: 'Start Date (YYYY-MM-DD)', example: '2023-01-01' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	startDate?: string;

	@ApiPropertyOptional({ description: 'End Date (YYYY-MM-DD)', example: '2023-12-31' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	endDate?: string;

	@ApiPropertyOptional({ description: 'Bulan stok (1-12)', example: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(12)
	month?: number;

	@ApiPropertyOptional({ description: 'Tahun stok', example: 2026 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(2000)
	year?: number;
}
