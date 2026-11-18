import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SelectionStatus, TypePenjualan } from '@prisma/client';

export class GetDeliveryOrderPRADto {
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

	@ApiPropertyOptional({ description: 'status', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	status?: string;

	@ApiPropertyOptional({ description: 'selectionStatus', example: 'SELECTED | NOT_SELECTED' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	selectionStatus?: SelectionStatus;

	@ApiPropertyOptional({ description: 'typePo', example: 'RA | RN' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	typeSalesDelivery?: TypePenjualan;

	@ApiPropertyOptional({ description: 'orderNumber', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	orderNumber?: string;

	@ApiPropertyOptional({ description: 'customerName', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	customerName?: string;

	@ApiPropertyOptional({ description: 'address', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	address?: string;

	@ApiPropertyOptional({ description: 'Date', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	date?: string;

	@ApiPropertyOptional({ description: 'franco', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	franco?: string;

	@ApiPropertyOptional({ description: 'description', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	description?: string;

	@ApiPropertyOptional({ description: 'subtotalAmount', example: 10 })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	subtotalAmount: number;
}
