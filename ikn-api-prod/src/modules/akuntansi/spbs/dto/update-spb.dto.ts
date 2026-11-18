import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import * as Validators from 'class-validator';

export class UpdateSpbItemDto {
	@Validators.IsString({ message: 'productId harus string' })
	@Validators.IsNotEmpty({ message: 'productId tidak boleh kosong' })
	@ApiProperty({
		description: 'Product ID',
		type: String,
		example: 'uuid-product',
	})
	productId: string;

	@Transform(({ value }) => {
		if (typeof value === 'string') {
			return Number(value.replace(',', '.'));
		}
		return value;
	})
	@Validators.IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'qtyKirim harus berupa angka' })
	@Validators.Min(0.01, {
		message: 'qtyKirim harus lebih dari 0',
	})
	@ApiProperty({
		description: 'Qty Kirim',
		type: Number,
		example: 1.5,
	})
	qtyKirim: number;
}

export class UpdateSpbDto {
	@Validators.IsString({ message: 'noSpb harus string' })
	@Validators.IsNotEmpty({ message: 'noSpb tidak boleh kosong' })
	@ApiProperty({
		description: 'Nomor SPB',
		type: String,
		example: 'SPB/001/2026',
	})
	noSpb: string;

	@Validators.IsString({ message: 'tanggalPengiriman harus string' })
	@Validators.IsNotEmpty({ message: 'tanggalPengiriman tidak boleh kosong' })
	@ApiProperty({
		description: 'tanggalPengiriman',
		type: String,
		example: '',
	})
	tanggalPengiriman: string;

	@Validators.IsString({ message: 'namaAtasan harus string' })
	@Validators.IsOptional()
	@ApiProperty({
		description: 'Nama atasan',
		type: String,
		required: false,
		example: 'Budi Santoso',
	})
	namaAtasan?: string;

	@Validators.IsString({ message: 'jabatanAtasan harus string' })
	@Validators.IsOptional()
	@ApiProperty({
		description: 'Jabatan atasan',
		type: String,
		required: false,
		example: 'Kepala Bagian',
	})
	jabatanAtasan?: string;

	@Validators.IsString({ message: 'dikirimDengan harus string' })
	@Validators.IsOptional()
	@ApiProperty({
		description: 'Dikirim dengan',
		type: String,
		required: false,
		example: 'Truck',
	})
	dikirimDengan?: string;

	@Validators.IsArray()
	@Validators.IsOptional()
	@Validators.ValidateNested({ each: true })
	@Type(() => UpdateSpbItemDto)
	@ApiProperty({
		description: 'Data item SPB',
		type: [UpdateSpbItemDto],
		required: false,
	})
	items?: UpdateSpbItemDto[];
}
