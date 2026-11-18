import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';

export class CreateSupplierDto {
	@Validators.IsString({ message: 'nomorPengenal harus string' })
	@Validators.IsNotEmpty({ message: 'nomorPengenal tidak boleh kosong' })
	@ApiProperty({ description: 'nomorPengenal', type: String, example: '105.015.94' })
	nomorPengenal: string;

	@Validators.IsString({ message: 'namaRekanan harus string' })
	@Validators.IsNotEmpty({ message: 'namaRekanan tidak boleh kosong' })
	@ApiProperty({ description: 'namaRekanan', type: String, example: 'PT. Maju Jaya' })
	namaRekanan: string;

	@Validators.IsString({ message: 'alamatRekanan harus string' })
	@Validators.IsNotEmpty({ message: 'alamatRekanan tidak boleh kosong' })
	@ApiProperty({ description: 'alamatRekanan', type: String, example: 'Jln. Muwardi No. 539, Malang 21952, SumUt' })
	alamatRekanan: string;

	@Validators.IsString({ message: 'accountCode harus string' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String, example: 'Jln. Muwardi No. 539, Malang 21952, SumUt' })
	accountCode: string;

	@Validators.IsString({ message: 'code harus string' })
	@Validators.IsNotEmpty({ message: 'code tidak boleh kosong' })
	@ApiProperty({ description: 'code', type: String })
	code: string;
}
