import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
export class GetBankAccountDto {
	@ApiPropertyOptional({ description: 'code' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	code?: string;

	@ApiPropertyOptional({ description: 'bankAccountNumber' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	bankAccountNumber?: string;

	@ApiPropertyOptional({ description: 'page' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	page?: number;

	@ApiPropertyOptional({ description: 'limit' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	limit?: number;

	@ApiPropertyOptional({ description: 'accountCode' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	accountCode: string;

	@ApiPropertyOptional({ description: 'bankName' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	bankName: string;

	@ApiPropertyOptional({ description: 'branchAddress' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	branchAddress: string;

	@ApiPropertyOptional({ description: 'bankCode' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	bankCode: string;

	@ApiPropertyOptional({ description: 'currency' })
	@IsOptional()
	// @Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => String)
	@IsString()
	currency: string;
}
