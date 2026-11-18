import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';

export class UpdateInvoiceDto {
	@Validators.IsString({ message: 'invoiceNumber harus string' })
	@Validators.IsNotEmpty({ message: 'invoiceNumber tidak boleh kosong' })
	@ApiProperty({
		description: 'Nomor Invoice',
		type: String,
		example: 'INV/RA/09/2026/0001',
	})
	invoiceNumber: string;

	@Validators.IsString({ message: 'invoiceDate harus string' })
	@Validators.IsNotEmpty({ message: 'invoiceDate tidak boleh kosong' })
	@ApiProperty({
		description: 'Tanggal Invoice',
		type: String,
		example: '2026-09-30T00:00:00.000Z',
	})
	invoiceDate: string;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'bankAccountId harus string' })
	@ApiProperty({
		description: 'Bank Account ID',
		type: String,
		required: false,
	})
	bankAccountId?: string;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'namaAtasan harus string' })
	@ApiProperty({
		description: 'Nama Atasan',
		type: String,
		required: false,
	})
	namaAtasan?: string;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'jabatanAtasan harus string' })
	@ApiProperty({
		description: 'Jabatan Atasan',
		type: String,
		required: false,
	})
	jabatanAtasan?: string;
}