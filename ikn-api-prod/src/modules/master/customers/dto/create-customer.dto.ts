import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';

export class CreateCustomerDto {
	@Validators.IsString({ message: 'kode harus string' })
	@Validators.IsNotEmpty({ message: 'kode tidak boleh kosong' })
	@ApiProperty({ description: 'kode', type: String, example: 'CST-0001' })
	code: string;

	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String, example: 'PT. Example' })
	name: string;

	@Validators.IsString({ message: 'email harus string' })
	@Validators.IsNotEmpty({ message: 'email tidak boleh kosong' })
	@ApiProperty({ description: 'email', type: String, example: 'email example' })
	email: string;

	@Validators.IsString({ message: 'address harus string' })
	@Validators.IsNotEmpty({ message: 'address tidak boleh kosong' })
	@ApiProperty({ description: 'address', type: String, example: 'Jl. example' })
	address: string;

	@Validators.IsString({ message: 'unit harus string' })
	@Validators.IsNotEmpty({ message: 'unit tidak boleh kosong' })
	@ApiProperty({ description: 'unit', type: String, example: 'unit example' })
	unit: string;

	@Validators.IsString({ message: 'phone harus string' })
	@Validators.IsNotEmpty({ message: 'phone tidak boleh kosong' })
	@ApiProperty({ description: 'phone', type: String, example: '08557868666' })
	phone: string;

	@Validators.IsString({ message: 'country harus string' })
	// @Validators.IsNotEmpty({ message: 'country tidak boleh kosong' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'country', type: String, example: 'Indonesia' })
	country: string;

	// @Validators.IsString({ message: 'continent harus string' })
	// @Validators.IsNotEmpty({ message: 'continent tidak boleh kosong' })
	@ApiProperty({ description: 'continent', type: String, example: 'Asia' })
	@Validators.IsString({ message: 'continent harus string' })
	@Validators.IsOptional()
	continent: string;

	@Validators.IsString({ message: 'regional_type harus string' })
	@Validators.IsNotEmpty({ message: 'regional_type tidak boleh kosong' })
	@ApiProperty({ description: 'regional ype', type: String, example: 'domestic' })
	regional_type: string;
}
