import { ApiProperty } from '@nestjs/swagger';
import * as Transformers from 'class-transformer';
import * as Validators from 'class-validator';

export class CreateInventorisDtoItemDto {
	@Validators.IsDefined({ message: 'quantity wajib diisi' })
	@Validators.IsNumber(
		{ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4 },
		{ message: 'quantity harus berupa angka yang valid dengan maksimal 4 angka desimal' },
	)
	@Validators.IsPositive({ message: 'quantity harus lebih besar dari 0' })
	@ApiProperty({
		description: 'Jumlah barang yang diterima',
		type: Number,
		example: 2.5,
		minimum: 0,
	})
	quantity: number;

	@Validators.IsString({ message: 'satuan harus berupa string' })
	@Validators.IsNotEmpty({ message: 'satuan tidak boleh kosong' })
	@ApiProperty({
		description: 'Satuan barang',
		type: String,
		example: 'pcs',
	})
	satuan: string;

	@Validators.IsString({ message: 'spesifikasi harus berupa string' })
	@Validators.IsNotEmpty({ message: 'spesifikasi tidak boleh kosong' })
	@ApiProperty({
		description: 'Spesifikasi barang',
		type: String,
		example: 'Spesifikasi barang',
	})
	spesifikasi: string;

	@Validators.IsString({ message: 'finishedGoodId harus berupa string' })
	@Validators.IsNotEmpty({ message: 'finishedGoodId tidak boleh kosong' })
	@ApiProperty({
		description: 'ID master barang jadi',
		type: String,
		example: 'finished-good-id',
	})
	finishedGoodId: string;

	@Validators.IsDefined({ message: 'nilaiSatuan wajib diisi' })
	@Validators.IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'nilaiSatuan harus berupa angka yang valid' })
	@Validators.Min(0, { message: 'nilaiSatuan tidak boleh negatif' })
	@ApiProperty({
		description: 'Nilai atau harga satuan barang',
		type: Number,
		example: 15000,
		minimum: 0,
	})
	nilaiSatuan: number;

	@Validators.IsString({ message: 'namaBarang harus berupa string' })
	@Validators.IsNotEmpty({ message: 'namaBarang tidak boleh kosong' })
	@ApiProperty({
		description: 'Nama barang',
		type: String,
		example: 'Barang Jadi A',
	})
	namaBarang: string;

	@Validators.IsString({ message: 'kodeBarang harus berupa string' })
	@Validators.IsNotEmpty({ message: 'kodeBarang tidak boleh kosong' })
	@ApiProperty({
		description: 'Kode barang',
		type: String,
		example: 'BJ001',
	})
	kodeBarang: string;

	@Validators.IsString({ message: 'kategori harus berupa string' })
	@Validators.IsNotEmpty({ message: 'kategori tidak boleh kosong' })
	@ApiProperty({
		description: 'Kategori barang',
		type: String,
		example: 'Barang Jadi',
	})
	kategori: string;

	@Validators.IsString({ message: 'unitId harus berupa string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({
		description: 'ID unit penerimaan',
		type: String,
		example: 'unit-id',
	})
	unitId: string;
}

export class CreateInventorisDto {
	@Validators.IsString({ message: 'documentCode harus berupa string' })
	@Validators.IsNotEmpty({ message: 'documentCode tidak boleh kosong' })
	@ApiProperty({
		description: 'Kode dokumen penerimaan',
		type: String,
		example: 'BJ-001',
	})
	documentCode: string;

	@Validators.IsString({ message: 'documentNumber harus berupa string' })
	@Validators.IsNotEmpty({ message: 'documentNumber tidak boleh kosong' })
	@ApiProperty({
		description: 'Nomor dokumen penerimaan',
		type: String,
		example: '001/BJ/X/2026',
	})
	documentNumber: string;

	@Validators.IsString({ message: 'unitId harus berupa string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({
		description: 'ID unit penerimaan',
		type: String,
		example: 'unit-id',
	})
	unitId: string;

	@Transformers.Type(() => Date)
	@Validators.IsDate({ message: 'date harus berupa tanggal yang valid' })
	@ApiProperty({
		description: 'Tanggal penerimaan barang',
		type: String,
		format: 'date-time',
		example: '2026-10-26T00:00:00.000Z',
	})
	date: Date;

	@Validators.IsArray({ message: 'items harus berupa array' })
	@Validators.ArrayMinSize(1, {
		message: 'Penerimaan harus memiliki minimal 1 item',
	})
	@Validators.ValidateNested({ each: true })
	@Transformers.Type(() => CreateInventorisDtoItemDto)
	@ApiProperty({
		description: 'Daftar detail barang yang diterima',
		type: [CreateInventorisDtoItemDto],
		minItems: 1,
	})
	items: CreateInventorisDtoItemDto[];
}
