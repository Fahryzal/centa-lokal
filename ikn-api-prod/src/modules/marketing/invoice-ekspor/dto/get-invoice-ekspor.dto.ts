import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Incoterms, StatusInvoice, TypePayment } from '@prisma/client';

export class GetInvoiceEksporDto {
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
	@IsOptional()
	@Type(() => String)
	@IsString()
	invoiceNumber?: string;

	@ApiPropertyOptional({ description: 'proformaNumber', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	proformaNumber?: string;

	@ApiPropertyOptional({ description: 'date', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	date?: string;

	@ApiPropertyOptional({ description: 'paymentDate', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	paymentDate?: string;

	@ApiPropertyOptional({ description: 'purchaseOrder', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	purchaseOrder?: string;

	@ApiPropertyOptional({ description: 'customerName ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	customerName?: string;

	@ApiPropertyOptional({ description: 'incoterms ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	incoterms?: Incoterms;

	@ApiPropertyOptional({ description: 'status ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	status?: StatusInvoice;

	@ApiPropertyOptional({ description: 'totalCIF ', example: '' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	totalCIF?: number;

	@ApiPropertyOptional({ description: 'typePayment ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	typePayment?: TypePayment;

	@ApiPropertyOptional({ description: 'Sort by', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortBy?: string;

	@ApiPropertyOptional({ description: 'sortOrder ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	sortOrder?: string;

	@ApiPropertyOptional({ description: 'description ', example: '' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	description?: string;
}
