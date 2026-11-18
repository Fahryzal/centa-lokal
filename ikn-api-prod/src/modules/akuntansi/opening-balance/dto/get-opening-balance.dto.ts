import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class GetOpeningBalanceDto {
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

	@ApiPropertyOptional({ description: 'fiscalYear', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	fiscalYear?: string;

	@ApiPropertyOptional({ description: 'namaUnit', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	namaUnit?: string;

	@ApiPropertyOptional({ description: 'notes', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	notes?: string;

	@ApiPropertyOptional({ description: 'status', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	status?: string;

	@ApiPropertyOptional({ description: 'nameStaff', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	nameStaff?: string;

	@ApiPropertyOptional({ description: 'totalBalance', example: '' })
	@Type(() => Number)
	@IsOptional()
	@IsNumber()
	totalBalance?: number;

	@ApiPropertyOptional({ description: 'date', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	date?: Date;

	@ApiPropertyOptional({ description: 'isMaterial', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	isMaterial?: string;
}
