import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreateSatuanDto {
	@Validators.IsString({ message: 'kode harus string' })
	@Validators.IsNotEmpty({ message: 'kode tidak boleh kosong' })
	@ApiProperty({ description: 'kode', type: String, example: 'STN-0001' })
	kode: string;

	@Validators.IsString({ message: 'keterangan harus string' })
	@Validators.IsNotEmpty({ message: 'keterangan tidak boleh kosong' })
	@ApiProperty({ description: 'keterangan', type: String, example: 'Satuan Example' })
	keterangan: string;

	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'nama', type: String, example: 'name Example' })
	name: string;
}
