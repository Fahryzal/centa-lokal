import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
export class GetBankNumberDto {
	@ApiPropertyOptional({ description: 'bankAccountId', example: 'UUID' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	bankAccountId?: string;

	@ApiPropertyOptional({ description: 'tanggal', example: '2025-06-03T12:34:56Z' })
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	tanggal?: Date;
}
