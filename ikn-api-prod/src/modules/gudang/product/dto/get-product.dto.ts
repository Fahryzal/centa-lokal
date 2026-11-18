import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
export class GetProductDto {
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

	@ApiPropertyOptional({ description: 'Sort by' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortBy?: string;

	@ApiPropertyOptional({ description: 'Nama ' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortOrder?: string;

	@ApiPropertyOptional({ description: 'quantity' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	quantity?: number;

	@ApiPropertyOptional({ description: 'Satuan' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	Satuan?: string;

	@ApiPropertyOptional({ description: 'nilaiSatuan' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	nilaiSatuan?: number;

	@ApiPropertyOptional({ description: 'stok' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	stok?: number;

	@ApiPropertyOptional({ description: 'spesifikasi' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	spesifikasi?: string;

	@ApiPropertyOptional({ description: 'Total' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	Total?: number;

	@ApiPropertyOptional({ description: 'unit' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unit?: string;

	@ApiPropertyOptional({ description: 'namaBarang' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	namaBarang?: string;

	@ApiPropertyOptional({ description: 'kodeBarang' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kodeBarang?: string;

	@ApiPropertyOptional({ description: 'stokTerkini' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	stokTerkini: number;

	@ApiPropertyOptional({ description: 'kategori' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kategori: number;

	@ApiPropertyOptional({ description: 'date' })
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	date: Date;
}
