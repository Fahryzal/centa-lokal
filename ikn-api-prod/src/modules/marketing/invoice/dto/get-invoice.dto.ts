import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SelectionStatus, StatusInvoice, TypePenjualan } from '@prisma/client';

export class GetInvoiceDto {
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

	@ApiPropertyOptional({ description: 'invoiceNumber', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	invoiceNumber?: string;

	@ApiPropertyOptional({ description: 'amount', example: '' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	amount?: number;

	@ApiPropertyOptional({ description: 'totalAmount', example: '' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	totalAmount?: number;

	@ApiPropertyOptional({ description: 'amountWithTax', example: '' })
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	amountWithTax?: number;

	@ApiPropertyOptional({ description: 'date' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	selectionStatusInvoice: SelectionStatus;

	@ApiPropertyOptional({ description: 'IsEkspor' })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	IsNonEkspor: boolean;

	@ApiPropertyOptional({ description: 'status' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	status: StatusInvoice;

	@ApiPropertyOptional({ description: 'orderNumber' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	orderNumber: string;

	@ApiPropertyOptional({ description: 'customerName' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	customerName: string;

	@ApiPropertyOptional({ description: 'phone' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	phone: string;

	@ApiPropertyOptional({ description: 'typeInvoice' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typeInvoice: TypePenjualan;

	@ApiPropertyOptional({ description: 'Date', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	date?: string;

	@ApiPropertyOptional({ description: 'invoiceDate', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	invoiceDate: string;

	@ApiPropertyOptional({ description: 'description', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	description?: string;

	@ApiPropertyOptional({ description: 'franco', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	franco?: string;
}
