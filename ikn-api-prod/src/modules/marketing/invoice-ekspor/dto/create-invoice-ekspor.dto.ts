import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';
import { Incoterms, TypePayment } from '@prisma/client';

// ====================== Cost Summary ======================
export class CreateCostSummaryDto {
	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'amount tidak boleh kosong' })
	@ApiProperty({ description: 'amount', type: Number })
	amount: number;

	@Validators.IsString({ message: 'description tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'description tidak boleh kosong' })
	@ApiProperty({ description: 'description', type: String })
	description: string;

	@Validators.IsString({ message: 'type tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'type tidak boleh kosong' })
	@ApiProperty({ description: 'type', type: String })
	type: string;
}

// ====================== Main DTO ======================
export class CreateInvoiceEksporDto {
	@Validators.IsString()
	@Validators.IsNotEmpty()
	@ApiProperty({ example: 'IKN.PPN/INV/PRPNE/007/2025' })
	invoiceNumber: string;

	@Validators.IsString()
	@Validators.IsNotEmpty()
	@ApiProperty({ example: 'IKN.PPN/PINV/PRPNE/007/2025', required: false })
	proformaNumber?: string;

	@Validators.IsDateString()
	@Validators.IsNotEmpty()
	@ApiProperty({ example: '2025-02-18' })
	date: Date;

	@Validators.IsString()
	@Validators.IsNotEmpty()
	@ApiProperty({ example: 'CR250218' })
	purchaseOrder: string;

	@Validators.IsString()
	@Validators.IsNotEmpty()
	@ApiProperty({ example: 'uuid-customer' })
	customerId: string;

	@Validators.IsNumber()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	totalCIF: number;

	@ApiProperty({ example: 'USD', default: 'USD' })
	@Validators.IsOptional()
	currency?: string;

	@Validators.IsString()
	@Validators.IsNotEmpty()
	@ApiProperty({ example: 'Pengiriman ekspor ke Jerman', required: false })
	description?: string;

	@Validators.IsString({ message: 'Incoterms Harus String' })
	// @ApiProperty()
	incoterms: Incoterms;

	@Validators.IsOptional()
	@ApiProperty({ description: 'typePayment', type: String })
	typePayment: TypePayment;

	@Validators.IsOptional()
	@ApiProperty({ description: 'downPayment', type: Number })
	downPayment: number;

	@Validators.IsString()
	@Validators.IsOptional()
	@ApiProperty({ required: false })
	fileUrl?: string;

	@Validators.IsString()
	@ApiProperty({ required: false })
	spbId: string;

	@Validators.ValidateNested()
	@Transformers.Type(() => CreateCostSummaryDto)
	@ApiProperty({ type: [CreateCostSummaryDto] })
	@Validators.IsOptional()
	additionalCharges: CreateCostSummaryDto[];
}
