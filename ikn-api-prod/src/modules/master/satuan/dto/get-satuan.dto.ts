import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSatuantDto {
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

	@ApiPropertyOptional({ description: 'keterangan' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	keterangan: string;

	@ApiPropertyOptional({ description: 'kode' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kode?: string;

	@ApiPropertyOptional({ description: 'name' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	name?: string;
}
