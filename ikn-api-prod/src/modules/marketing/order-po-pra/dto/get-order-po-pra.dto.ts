import { ApiPropertyOptional } from '@nestjs/swagger';
import { CekPajak, PurchaseOrderStatus, SelectionStatus, TypePenjualan } from '@prisma/client';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetOrderPoPRADto {
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

	@ApiPropertyOptional({ description: 'Date', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	date?: string;

	@ApiPropertyOptional({ description: 'desc', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	description?: string;

	@ApiPropertyOptional({ description: 'customerName', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	customerName: string;

	@ApiPropertyOptional({ description: 'Franco', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	franco?: string;

	@ApiPropertyOptional({ description: 'Sub total amount', example: '' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	subtotalAmount?: number;

	@ApiPropertyOptional({ description: 'Total amount', example: '' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	totalAmount?: number;

	@ApiPropertyOptional({ description: 'Item code', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	itemCode?: string;

	@ApiPropertyOptional({ description: 'Item name', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	itemName?: string;

	@ApiPropertyOptional({ description: 'Unit', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unit?: string;

	@ApiPropertyOptional({ description: 'Quantity', example: '' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	quantity?: number;

	@ApiPropertyOptional({ description: 'Unit price', example: '' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	unitPrice?: number;

	@ApiPropertyOptional({ description: 'Total', example: '' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	total?: number;

	@ApiPropertyOptional({ description: 'Cek pajak', example: false })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	isCekPajak?: boolean;

	@ApiPropertyOptional({ description: 'selectionStatus', example: 'SELECTED | NOT_SELECTED' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	selectionStatus?: SelectionStatus;

	@ApiPropertyOptional({ description: 'selectionStatusInvoice', example: 'SELECTED | NOT_SELECTED' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	selectionStatusInvoice?: SelectionStatus;
	@IsOptional()
	@IsEnum(SelectionStatus)
	invoiceSelectionStatus?: SelectionStatus;

	@ApiPropertyOptional({ description: 'status' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	status?: PurchaseOrderStatus;

	@ApiPropertyOptional({ description: 'typePo' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	typePo?: TypePenjualan;

	@ApiPropertyOptional({ description: 'cekPajak' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	cekPajak?: CekPajak;
}
