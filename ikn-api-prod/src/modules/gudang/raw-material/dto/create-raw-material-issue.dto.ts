import { ApiProperty } from '@nestjs/swagger';
import { DiPergunakan } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class CreateRawMaterialItemsDto {
	@IsString({ message: 'masterRawMaterialId harus berupa teks' })
	@IsNotEmpty({ message: 'masterRawMaterialId tidak boleh kosong' })
	@ApiProperty({ description: 'masterRawMaterialId', type: String })
	masterRawMaterialId: string;

	@IsString({ message: 'Satuan harus berupa teks' })
	@IsNotEmpty({ message: 'Satuan tidak boleh kosong' })
	@ApiProperty({ description: 'Satuan', type: String })
	Satuan: string;

	@IsNumber({}, { message: 'nilaiSatuan harus berupa angka' })
	@Min(0, { message: 'nilaiSatuan tidak boleh negatif' })
	@Type(() => Number)
	@ApiProperty({ description: 'nilaiSatuan', type: Number, example: 200 })
	nilaiSatuan: number;

	@IsNumber({}, { message: 'quantity harus berupa angka' })
	@Min(0.000001, { message: 'quantity harus lebih besar dari nol' })
	@Type(() => Number)
	@ApiProperty({ description: 'quantity', type: Number, example: 1.5 })
	quantity: number;

	@IsString({ message: 'accountCode harus berupa teks' })
	@IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String })
	accountCode: string;

	@IsString({ message: 'accountName harus berupa teks' })
	@IsNotEmpty({ message: 'accountName tidak boleh kosong' })
	@ApiProperty({ description: 'accountName', type: String })
	accountName: string;
}

export class CreateRawMaterialIssueDto {
	@IsString({ message: 'documentCode harus berupa teks' })
	@IsNotEmpty({ message: 'documentCode tidak boleh kosong' })
	@ApiProperty({ description: 'documentCode', type: String })
	documentCode: string;

	@IsString({ message: 'documentNo harus berupa teks' })
	@IsNotEmpty({ message: 'documentNo tidak boleh kosong' })
	@ApiProperty({ description: 'documentNo', type: String })
	documentNo: string;

	@IsString({ message: 'keterangan harus berupa teks' })
	@IsNotEmpty({ message: 'keterangan tidak boleh kosong' })
	@ApiProperty({ description: 'keterangan', type: String })
	keterangan: string;

	@IsEnum(DiPergunakan, { message: 'diPergunakan tidak valid' })
	@ApiProperty({
		description: 'Tujuan penggunaan bahan mentah',
		enum: DiPergunakan,
	})
	diPergunakan: DiPergunakan;

	@Type(() => Date)
	@IsDate({ message: 'date harus berupa tanggal yang valid' })
	@ApiProperty({
		description: 'Tanggal pengeluaran',
		type: String,
		format: 'date-time',
		example: '2025-05-26T10:30:00Z',
	})
	date: Date;

	@IsArray({ message: 'items harus berupa array' })
	@ValidateNested({ each: true })
	@Type(() => CreateRawMaterialItemsDto)
	@ApiProperty({
		type: [CreateRawMaterialItemsDto],
		description: 'Daftar item pengeluaran bahan mentah',
	})
	items: CreateRawMaterialItemsDto[];
}
