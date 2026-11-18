import { ApiPropertyOptional } from '@nestjs/swagger';
import { TypePenjualan } from '@prisma/client';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class GetMareketingRaDto {
	@ApiPropertyOptional({ description: 'productName' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	productName: string;

	@ApiPropertyOptional({ description: 'kategori' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	kategori: string;

	@ApiPropertyOptional({ description: 'year' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	year: number;

	@ApiPropertyOptional({ description: 'month' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	month: number;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId: string;

	@ApiPropertyOptional({ description: 'typePo' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typePo: string;
}

export class GetInvoiceDto {
	@ApiPropertyOptional({ description: 'year' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	year: number;

	@ApiPropertyOptional({ description: 'month' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	month: number;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId: string;

	@ApiPropertyOptional({ description: 'typePo' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typePo: string;
}

export class GetSalesPlanDto {
	@ApiPropertyOptional({ description: 'year' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	year: number;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId: string;

	@ApiPropertyOptional({ description: 'typePo' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typePo: string;
}

export class GetBuyerDto {
	@ApiPropertyOptional({ description: 'year' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	year: number;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId: string;

	@ApiPropertyOptional({ description: 'typePo' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typePo: TypePenjualan;

	@ApiPropertyOptional({ description: 'namaBarang' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	namaBarang: string;

	@ApiPropertyOptional({ description: 'customerName' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	customerName: string;

	@ApiPropertyOptional({ description: 'month' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	month: string;
}
