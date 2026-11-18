import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import { IsDate } from 'class-validator';
import { SetTransform } from '@common/utils/helper/transform.helper';

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SelectionStatus, TypePenjualan } from '@prisma/client';

export class GetLaporanPenjualanItemDto {
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

	@ApiPropertyOptional({ description: 'kategoriProduct' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kategoriProduct: string;

	@ApiPropertyOptional({ description: 'kodeBarangProduct' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kodeBarangProduct: string;

	@ApiPropertyOptional({ description: 'namabarangProduct' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	namabarangProduct: string;

	@ApiPropertyOptional({ description: 'satuanProduct' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	satuanProduct: string;

	@ApiPropertyOptional({ description: 'spesifikasiProduct' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	spesifikasiProduct: string;

	@ApiPropertyOptional({ description: 'unitProduct' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitProduct: string;

	@ApiPropertyOptional({ description: 'typeSalesSPb' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typeSalesSPb: TypePenjualan;

	@ApiPropertyOptional({ description: 'quantity' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	quantity: number;

	@ApiPropertyOptional({ description: 'unitPrice' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	unitPrice: number;

	@ApiPropertyOptional({ description: 'beratproduct' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	beratproduct: number;

	@ApiPropertyOptional({ description: 'priceProduct' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	priceProduct: number;

	@ApiPropertyOptional({ description: 'stockProduct' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	stockProduct: number;

	@ApiPropertyOptional({ description: 'stockProduct' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	orderNumber: string;

	@ApiPropertyOptional({ description: 'startDate', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	startDate?: string;

	@ApiPropertyOptional({ description: 'endDate', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	endDate?: string;

	@ApiPropertyOptional({ description: 'tanggalPengiriman', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	tanggalPengiriman?: string;

	@ApiPropertyOptional({ description: 'noSpb', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	noSpb?: string;

	@ApiPropertyOptional({ description: 'invoiceNumber', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	invoiceNumber?: string;

	@ApiPropertyOptional({ description: 'description', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ description: 'franco', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	franco?: string;
}
