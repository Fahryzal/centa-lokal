import { ApiProperty } from '@nestjs/swagger';
import * as Transformers from 'class-transformer';
import * as Validators from 'class-validator';

export class CreateFinishedGoodsIssueDtoItemDto {
	@Validators.IsDefined({ message: 'quantity wajib diisi' })
	@Validators.IsNumber(
		{ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4 },
		{ message: 'quantity harus berupa angka yang valid dengan maksimal 4 angka desimal' },
	)
	@Validators.IsPositive({ message: 'quantity harus lebih besar dari 0' })
	@ApiProperty({
		description: 'Jumlah barang jadi yang dikeluarkan',
		type: Number,
		example: 2.5,
		minimum: 0,
	})
	quantity: number;

	@Validators.IsString({ message: 'Satuan harus berupa string' })
	@Validators.IsNotEmpty({ message: 'Satuan tidak boleh kosong' })
	@ApiProperty({
		description: 'Satuan barang jadi',
		type: String,
		example: 'pcs',
	})
	Satuan: string;

	@Validators.IsString({ message: 'finishedGoodId harus berupa string' })
	@Validators.IsNotEmpty({ message: 'finishedGoodId tidak boleh kosong' })
	@ApiProperty({
		description: 'ID master barang jadi',
		type: String,
		example: 'finished-good-id',
	})
	finishedGoodId: string;
}

export class CreateFinishedGoodsIssueDto {
	@Validators.IsString({ message: 'documentCode harus berupa string' })
	@Validators.IsNotEmpty({ message: 'documentCode tidak boleh kosong' })
	@ApiProperty({
		description: 'Kode dokumen pengeluaran barang jadi',
		type: String,
		example: 'PGB-001',
	})
	documentCode: string;

	@Validators.IsString({ message: 'documentNumber harus berupa string' })
	@Validators.IsNotEmpty({ message: 'documentNumber tidak boleh kosong' })
	@ApiProperty({
		description: 'Nomor dokumen pengeluaran barang jadi',
		type: String,
		example: '001/PGB/X/2026',
	})
	documentNumber: string;

	@Validators.IsString({ message: 'unitId harus berupa string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({
		description: 'ID unit pengeluaran barang jadi',
		type: String,
		example: 'unit-id',
	})
	unitId: string;

	@Transformers.Type(() => Date)
	@Validators.IsDefined({ message: 'date wajib diisi' })
	@Validators.IsDate({ message: 'date harus berupa tanggal yang valid' })
	@ApiProperty({
		description: 'Tanggal pengeluaran barang jadi',
		type: String,
		format: 'date-time',
		example: '2026-10-30T00:00:00.000Z',
	})
	date: Date;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'diPergunakan harus berupa string' })
	@ApiProperty({
		description: 'Tujuan penggunaan barang jadi',
		type: String,
		example: 'Pengambilan sampel',
		required: false,
	})
	diPergunakan?: string;

	@Validators.IsOptional()
	@Validators.IsString({ message: 'keterangan harus berupa string' })
	@ApiProperty({
		description: 'Keterangan pengeluaran barang jadi',
		type: String,
		example: 'Pengeluaran untuk keperluan sampel',
		required: false,
	})
	keterangan?: string;

	@Validators.IsDefined({ message: 'items wajib diisi' })
	@Validators.IsArray({ message: 'items harus berupa array' })
	@Validators.ArrayMinSize(1, {
		message: 'Pengeluaran harus memiliki minimal 1 item',
	})
	@Validators.ValidateNested({ each: true })
	@Transformers.Type(() => CreateFinishedGoodsIssueDtoItemDto)
	@ApiProperty({
		description: 'Daftar detail barang jadi yang dikeluarkan',
		type: [CreateFinishedGoodsIssueDtoItemDto],
		minItems: 1,
	})
	items: CreateFinishedGoodsIssueDtoItemDto[];
}

export class UpdateFinishedGoodsIssueDtoItemDto {
	@Validators.IsDefined({ message: 'quantity wajib diisi' })
	@Validators.IsNumber(
		{ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4 },
		{
			message: 'quantity harus berupa angka yang valid dengan maksimal 4 angka desimal',
		},
	)
	@Validators.IsPositive({
		message: 'quantity harus lebih besar dari 0',
	})
	@ApiProperty({
		description: 'Jumlah barang jadi yang dikeluarkan',
		type: Number,
		example: 2.5,
		minimum: 0,
	})
	quantity: number;

	@Validators.IsString({ message: 'Satuan harus berupa string' })
	@Validators.IsNotEmpty({ message: 'Satuan tidak boleh kosong' })
	@ApiProperty({
		description: 'Satuan barang jadi',
		type: String,
		example: 'pcs',
	})
	Satuan: string;

	@Validators.IsString({
		message: 'finishedGoodId harus berupa string',
	})
	@Validators.IsNotEmpty({
		message: 'finishedGoodId tidak boleh kosong',
	})
	@ApiProperty({
		description: 'ID master barang jadi',
		type: String,
		example: 'finished-good-id',
	})
	finishedGoodId: string;
}
