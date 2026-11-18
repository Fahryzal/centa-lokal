import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';

export class CreateInvoiceDto {
	@Validators.IsString({ message: 'purchaseOrderId harus string' })
	@Validators.IsNotEmpty({ message: 'purchaseOrderId tidak boleh kosong' })
	@ApiProperty({
		description: 'purchaseOrderId',
		type: String,
		example: 'uuid purchaseOrderId',
	})
	purchaseOrderId: string;

	@Validators.IsArray({ message: 'spbIds harus berupa array' })
	@Validators.ArrayNotEmpty({ message: 'spbIds tidak boleh kosong' })
	@Validators.IsString({
		each: true,
		message: 'setiap spbId harus berupa string',
	})
	@ApiProperty({
		description: 'Daftar SPB yang dipilih untuk Invoice',
		type: [String],
		example: ['uuid-spb-1', 'uuid-spb-2'],
	})
	spbIds: string[];

	@Validators.IsString({ message: 'invoiceNumber harus string' })
	@Validators.IsNotEmpty({ message: 'invoiceNumber tidak boleh kosong' })
	@ApiProperty({
		description: 'invoiceNumber',
		type: String,
		example: '',
	})
	invoiceNumber: string;

	@Validators.IsString({ message: 'invoiceDate harus string' })
	@Validators.IsNotEmpty({ message: 'invoiceDate tidak boleh kosong' })
	@ApiProperty({
		description: 'invoiceDate',
		type: String,
		example: '2025-04-29T00:00:00.000Z',
	})
	invoiceDate: string;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'bankAccountId harus string' })
	@ApiProperty({
		description: 'bankAccountId',
		type: String,
		required: false,
	})
	bankAccountId?: string;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'namaAtasan harus string' })
	@ApiProperty({
		description: 'namaAtasan',
		type: String,
		required: false,
	})
	namaAtasan?: string;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'jabatanAtasan harus string' })
	@ApiProperty({
		description: 'jabatanAtasan',
		type: String,
		required: false,
	})
	jabatanAtasan?: string;
}
