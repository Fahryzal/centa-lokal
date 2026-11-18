import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';

export class GetCustomerDto {
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
	@IsString()
	code?: string;

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@IsString()
	unit?: string;

	@IsOptional()
	@IsString()
	email?: string;

	@IsOptional()
	@IsNumber()
	phone?: number;

	@IsOptional()
	@IsString()
	country?: number;

	@IsOptional()
	@IsString()
	continent?: string;

	@IsOptional()
	@IsString()
	regional_type?: string;
}
