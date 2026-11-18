import { TypePenjualan } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class NetProfitFilterDto {
	@ApiPropertyOptional({ description: 'year' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	year?: string;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId?: string;

	@ApiPropertyOptional({ description: 'typeTransaction' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typeTransaction?: TypePenjualan; // RA, RN, RN EKSPOR
}

export class BankBalanceFilterDto {
	@ApiPropertyOptional({ description: 'year' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	year?: string; // contoh: "2024"

	@ApiPropertyOptional({ description: 'month' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	month?: string; // contoh: "01"

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId?: string; // opsional
}

// src/report/dto/expense-filter.dto.ts
export class ExpenseFilterDto {
	@ApiPropertyOptional({ description: 'year' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	year!: string; // contoh: "2025" (required)

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsOptional()
	@IsString()
	unitId?: string;
}

// src/report/interfaces/expense-record.interface.ts
export interface ExpenseRecord {
	accountCode: string;
	category: string; // account.name
	value: number; // total (debitTotal - creditTotal)
	year: string;
	parentId: string;
}
