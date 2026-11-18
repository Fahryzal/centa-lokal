import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';

export class GetSalesPlanDto {
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	page?: number = 1;

	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	limit?: number = 10;

	@IsOptional()
	@Type(() => Date) // Mengonversi string ke Date
	@IsDate()
	date?: Date;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@IsNumber()
	value_rkap?: number;

	@IsOptional()
	@IsString()
	unit?: string;

	@IsOptional()
	@IsString()
	periode_month?: string;

	@IsOptional()
	@IsNumber()
	status?: number;

	@IsOptional()
	@IsString()
	typeSalesPlan?: string;
}
