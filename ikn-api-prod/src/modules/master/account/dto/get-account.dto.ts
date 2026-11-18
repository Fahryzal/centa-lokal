import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Islocked } from '@prisma/client';

export class GetAccountDto {
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

	@ApiPropertyOptional({ description: 'code', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	code?: string;

	@ApiPropertyOptional({ description: 'id', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	id?: string;

	@ApiPropertyOptional({ description: 'type', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	accountTypeName?: string;

	@ApiPropertyOptional({ description: 'Sort by', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortBy?: string;

	@ApiPropertyOptional({ description: 'sortOrder ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortOrder?: string;

	@ApiPropertyOptional({ description: 'name ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	name: string;

	@ApiPropertyOptional({ description: 'accountType ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	accountType: string;

	@ApiPropertyOptional({ description: 'typeNeraca ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typeNeraca: string;

	@ApiPropertyOptional({ description: 'parentName ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	parentName: string;

	@ApiPropertyOptional({ description: 'isLocked ', example: 'Y/N' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	isLocked: Islocked;
}
