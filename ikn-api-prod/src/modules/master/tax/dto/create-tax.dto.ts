import { ApiProperty } from '@nestjs/swagger';
import { TypeTax } from '@prisma/client';
import * as Validators from 'class-validator';

export class CreateTaxMasterDto {
	@Validators.IsString({ message: 'taxtType harus string' })
	@Validators.IsNotEmpty({ message: 'taxtType tidak boleh kosong' })
	@ApiProperty({ description: 'taxtType', type: String })
	taxtType: string;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'taxValue barang tidak boleh kosong' })
	@ApiProperty({ description: 'taxValue barang', type: Number })
	taxValue: number;

	@Validators.IsString()
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String })
	accountCode: string;

	@Validators.IsString()
	@Validators.IsNotEmpty({ message: 'namaAccount tidak boleh kosong' })
	@ApiProperty({ description: 'namaAccount', type: String })
	namaAccount: string;

	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String })
	type: TypeTax;
}
