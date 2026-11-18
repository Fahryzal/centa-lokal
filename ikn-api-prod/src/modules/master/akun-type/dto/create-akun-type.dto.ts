import { ApiProperty } from '@nestjs/swagger';
import { NormalBalance } from '@prisma/client';
import * as Validators from 'class-validator';

export class CreateAkunTypeDto {
	@Validators.IsString({ message: 'name barang harus string' })
	@Validators.IsNotEmpty({ message: 'name barang tidak boleh kosong' })
	@ApiProperty({ description: 'name barang', type: String })
	name: string;

	@Validators.IsString({ message: 'code barang harus string' })
	@Validators.IsNotEmpty({ message: 'code barang tidak boleh kosong' })
	@ApiProperty({ description: 'code barang', type: String })
	code: string;

	@Validators.IsString({ message: 'normalBalance barang harus string' })
	@Validators.IsNotEmpty({ message: 'normalBalance barang tidak boleh kosong' })
	@ApiProperty({ description: 'normalBalance barang', type: String })
	normalBalance: NormalBalance;

	@Validators.IsString({ message: 'description barang harus string' })
	@Validators.IsNotEmpty({ message: 'description barang tidak boleh kosong' })
	@ApiProperty({ description: 'description barang', type: String })
	description: string;
}
