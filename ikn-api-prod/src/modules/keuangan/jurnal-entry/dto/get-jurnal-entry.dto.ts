import { ApiPropertyOptional } from '@nestjs/swagger';
import { TypePenjualan } from '@prisma/client';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetJurnalEntryDto {
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

	@ApiPropertyOptional({ description: 'startDate', example: '2025-05-04T15:07:30.241Z' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	startDate: string;

	@ApiPropertyOptional({ description: 'endDate', example: '2025-05-09T15:07:30.241Z' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	endDate: string;

	@ApiPropertyOptional({ description: 'accountCode' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	accountCode: string;

	@ApiPropertyOptional({ description: 'description' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	description: string;

	@ApiPropertyOptional({ description: 'referenceNumber' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	referenceNumber: string;

	@ApiPropertyOptional({ description: 'jenisJurnal', example: 'penjualan | penerimaan' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	jenisJurnal: string;

	@ApiPropertyOptional({ description: 'numberJurnal' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	numberJurnal: string;

	@ApiPropertyOptional({ description: 'typeJournalEntry' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typeJournalEntry: TypePenjualan;

	@ApiPropertyOptional({ description: 'IsNottypeJournalEntry' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	IsNottypeJournalEntry: TypePenjualan;

	@ApiPropertyOptional({ description: 'generate PDF' })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	isDownload: boolean;

	@ApiPropertyOptional({ description: 'periode', example: '2025-05-04T15:07:30.241Z' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	periode: string;

	@ApiPropertyOptional({ description: 'isPosted' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	isPosted: string;

	@ApiPropertyOptional({ description: 'status' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	status: string;

	@ApiPropertyOptional({ description: 'total balance', example: 10 })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	totalBalance?: number;

	@ApiPropertyOptional({ description: 'date' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	date?: string;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId?: string;
}

export class GetJurnalEntryHeaderDto {
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

	@ApiPropertyOptional({ description: 'createdBy' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	createdBy: string;

	@ApiPropertyOptional({ description: 'isGeneral' })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	isGeneral: boolean;

	@ApiPropertyOptional({ description: 'typeJournalEnrty' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typeJournalEntry: TypePenjualan;

	@ApiPropertyOptional({ description: 'typeJournalEnrty Not In' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	IsNottypeJournalEntry: TypePenjualan;

	@ApiPropertyOptional({ description: 'status' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	status: string;

	@ApiPropertyOptional({ description: 'periode' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	periode: string;

	@ApiPropertyOptional({ description: 'total balance', example: 10 })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	totalBalance?: number;

	@ApiPropertyOptional({ description: 'total balance Us', example: 10 })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	totalBalanceUs?: number;

	@ApiPropertyOptional({ description: 'date' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	date?: string;

	@ApiPropertyOptional({ description: 'referenceNumber' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	referenceNumber?: string;

	@ApiPropertyOptional({ description: 'numberJurnal' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	numberJurnal?: string;

	@ApiPropertyOptional({ description: 'addjust', type: Boolean, nullable: true })
	@IsOptional()
	@Transformers.Transform(({ value }) => {
		if (value === 'null' || value === null) return null;
		return value === 'true' || value === true;
	})
	addjust?: boolean | null;
}
