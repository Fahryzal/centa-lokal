import { ApiProperty } from '@nestjs/swagger';
import { IsRoot } from '@prisma/client';
import * as Validators from 'class-validator';

export class CreateUserDto {
	@Validators.IsString({ message: 'email harus string' })
	@Validators.IsNotEmpty({ message: 'email tidak boleh kosong' })
	@ApiProperty({ description: 'email', type: String, example: 'ikn@gmail.com' })
	email: string;

	@Validators.IsString({ message: 'password harus string' })
	@Validators.IsNotEmpty({ message: 'password tidak boleh kosong' })
	@ApiProperty({ description: 'password', type: String, example: '*****' })
	password: string;

	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String, example: 'admin_gudang' })
	name: string;

	@Validators.IsString({ message: 'nik harus string' })
	@Validators.IsNotEmpty({ message: 'nik tidak boleh kosong' })
	@ApiProperty({ description: 'nik', type: String, example: '13545464' })
	nik: string;

	@Validators.IsString({ message: 'unitID harus string' })
	@Validators.IsNotEmpty({ message: 'unitID tidak boleh kosong' })
	@ApiProperty({ description: 'unitID', type: String, example: '13545464' })
	unitID: string;

	@Validators.IsString({ message: 'jabatan harus string' })
	@Validators.IsNotEmpty({ message: 'jabatan tidak boleh kosong' })
	@ApiProperty({ description: 'jabatan', type: String, example: 'staff finannce' })
	jabatan: string;

	@Validators.IsBoolean({ message: 'isPusat harus boolean' })
	@Validators.IsNotEmpty({ message: 'isPusat tidak boleh kosong' })
	@ApiProperty({ description: 'isPusat', type: Boolean, example: false })
	isPusat: boolean;

	@Validators.IsString({ message: 'isRoot harus string' })
	@Validators.IsNotEmpty({ message: 'isRoot tidak boleh kosong' })
	@ApiProperty({ description: 'isRoot', type: String, example: 'Y/N' })
	isRoot: IsRoot;

	@Validators.IsArray({ message: 'roleIds harus Array' })
	@Validators.IsNotEmpty({ message: 'roleIds tidak boleh kosong' })
	@ApiProperty({ description: 'jabatan', type: Array, example: [2, 3] })
	roleIds: [];
}

export class CreateRoleDto {
	name: string;
}
