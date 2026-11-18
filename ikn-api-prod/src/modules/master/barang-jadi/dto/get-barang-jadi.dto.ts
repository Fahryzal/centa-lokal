import { ApiPropertyOptional } from '@nestjs/swagger';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBarangjadiDto {
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

	@ApiPropertyOptional({ description: 'Kode barang', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kodeBarang?: string;

	@ApiPropertyOptional({ description: 'Kode kategori', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kodeKategori?: string;

	@ApiPropertyOptional({ description: 'Kode satuan', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kodeSatuan?: string;

	@ApiPropertyOptional({ description: 'Nama barang', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	namaBarang?: string;

	@ApiPropertyOptional({ description: 'Spesifikasi', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	spesifikasi?: string;

	@ApiPropertyOptional({ description: 'Berat', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsNumber()
	berat?: number;

	@ApiPropertyOptional({ description: 'Unit product', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitProduct?: string;

	@ApiPropertyOptional({ description: 'Satuan product', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	satuanProduct?: string;

	@ApiPropertyOptional({ description: 'kategori', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kategori?: string;

	@ApiPropertyOptional({ description: 'Sort by', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortBy?: string;

	@ApiPropertyOptional({ description: 'Nama ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortOrder?: string;

	@ApiPropertyOptional({ description: 'Start Date (YYYY-MM-DD)', example: '2023-01-01' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	startDate?: string;

	@ApiPropertyOptional({ description: 'End Date (YYYY-MM-DD)', example: '2023-12-31' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	endDate?: string;
}
