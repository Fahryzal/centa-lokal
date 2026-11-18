import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsCompleteSPB, TypePenjualan, SelectionStatus } from '@prisma/client';
export class GetSpbsDto {
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

	@ApiPropertyOptional({ description: 'Order Number', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	orderNumber?: string;

	@ApiPropertyOptional({ description: 'Tanggal', example: '' })
	@IsOptional()
	@Type(() => Date)
	date?: string | Date;

	@ApiPropertyOptional({ description: 'tanggalPengiriman', example: '' })
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	tanggalPengiriman: Date;

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

	@ApiPropertyOptional({ description: 'customerName', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	customerName?: string;

	@ApiPropertyOptional({ description: 'subtotalAmount', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	subtotalAmount?: string;

	@ApiPropertyOptional({ description: 'IsCompleteSPB', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	isComplete: IsCompleteSPB;

	@ApiPropertyOptional({ description: 'typeSalesSPb', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	typeSalesSPb: TypePenjualan;

	@ApiPropertyOptional({ description: 'noSpb', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	noSpb: string;

	@ApiPropertyOptional({ description: 'selectionStatus', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	selectionStatus: SelectionStatus;
}
