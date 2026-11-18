import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreateUnitDto {
	@Validators.IsString({ message: 'kode harus string' })
	@Validators.IsNotEmpty({ message: 'kode tidak boleh kosong' })
	@ApiProperty({ description: 'kode', type: String, example: 'U-0003' })
	kode: string;

	@Validators.IsString({ message: 'nama harus string' })
	@Validators.IsNotEmpty({ message: 'nama tidak boleh kosong' })
	@ApiProperty({ description: 'nama', type: String, example: 'Unit Example' })
	nama: string;
}
