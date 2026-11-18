import { ApiProperty } from '@nestjs/swagger';
import { PengadaanBarang } from '@prisma/client';
import { Type } from 'class-transformer';
import * as Validators from 'class-validator';

export class CreateRawMaterialItemsDto {
	@Validators.IsString({ message: 'masterRawMaterialId tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'masterRawMaterialId tidak boleh kosong' })
	@ApiProperty({ description: 'masterRawMaterialId', type: String })
	masterRawMaterialId: string;

	@Validators.IsString({ message: 'Satuan tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'Satuan tidak boleh kosong' })
	@ApiProperty({ description: 'Satuan', type: String })
	Satuan: string;

	@Validators.IsNumber()
	@Type(() => Number)
	@Validators.IsNotEmpty({ message: 'nilaiSatuan tidak boleh kosong' })
	@ApiProperty({ description: 'nilaiSatuan', type: Number, example: 200 })
	nilaiSatuan: number;

	@Validators.IsNumber()
	@Type(() => Number)
	@Validators.IsNotEmpty({ message: 'quantity tidak boleh kosong' })
	@ApiProperty({ description: 'quantity', type: Number, example: 1.5 })
	quantity: number;

	@Validators.IsString({ message: 'accountCode tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String })
	accountCode: string;

	@Validators.IsString({ message: 'accountName tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'accountName tidak boleh kosong' })
	@ApiProperty({ description: 'accountName', type: String })
	accountName: string;
}

export class CreateRawMaterialDto {
	@Validators.IsString({ message: 'documentCode tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'documentCode tidak boleh kosong' })
	@ApiProperty({ description: 'documentCode', type: String })
	documentCode: string;

	@Validators.IsString({ message: 'documentNo tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'documentNo tidak boleh kosong' })
	@ApiProperty({ description: 'documentNo', type: String })
	documentNo: string;

	@Validators.IsString({ message: 'idSupplier tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'idSupplier tidak boleh kosong' })
	@ApiProperty({ description: 'idSupplier', type: String })
	idSupplier: string;

	@Validators.IsDateString({}, { message: 'date harus berupa tanggal yang valid' })
	@Validators.IsNotEmpty({ message: 'date tidak boleh kosong' })
	@ApiProperty({
		description: 'Tanggal penerimaan',
		type: String,
		example: '2025-05-26T10:30:00Z',
	})
	date: Date;

	@Validators.IsString({ message: 'faktur tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'faktur tidak boleh kosong' })
	@ApiProperty({ description: 'faktur', type: String })
	faktur: string;

	@Validators.IsString({ message: 'noRekening tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'noRekening tidak boleh kosong' })
	@ApiProperty({ description: 'noRekening', type: String })
	noRekening: string;

	@Validators.IsString({ message: 'pengadaanBarang tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'pengadaanBarang tidak boleh kosong' })
	@ApiProperty({ description: 'pengadaanBarang', type: String })
	pengadaanBarang: PengadaanBarang;

	@Validators.IsString({ message: 'accountCode tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String })
	accountCode: string;

	@Validators.IsOptional()
	@Validators.IsBoolean({
		message: 'simpanKeBarangJadi harus berupa boolean',
	})
	@ApiProperty({
		description: 'Simpan penerimaan ke Barang Jadi',
		type: Boolean,
		required: false,
		default: false,
	})
	simpanKeBarangJadi?: boolean;

	@Validators.IsArray({ message: 'items harus berupa array' })
	@Validators.ArrayNotEmpty({ message: 'Item penerimaan wajib diisi' })
	@Validators.ValidateNested({ each: true })
	@Type(() => CreateRawMaterialItemsDto)
	@ApiProperty({ type: [CreateRawMaterialItemsDto] })
	items: CreateRawMaterialItemsDto[];
}
