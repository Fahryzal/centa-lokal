import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreateKategoriDto {
	@Validators.IsString({ message: 'kode harus string' })
	@Validators.IsNotEmpty({ message: 'kode tidak boleh kosong' })
	@ApiProperty({ description: 'kode', type: String, example: 'KTG-000001' })
	kode: string;

	@Validators.IsString({ message: 'nama harus string' })
	@Validators.IsNotEmpty({ message: 'nama tidak boleh kosong' })
	@ApiProperty({ description: 'nama', type: String, example: 'Kategori Example' })
	nama: string;
}
