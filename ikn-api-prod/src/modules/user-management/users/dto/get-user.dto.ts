import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import * as Validators from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsertDto {
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	page?: number = 1;

	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	limit?: number = 10;

	@IsOptional()
	@Validators.IsString({ message: 'email harus string' })
	@Validators.IsNotEmpty({ message: 'email tidak boleh kosong' })
	@ApiProperty({ description: 'email', type: String, example: 'ikn@gmail.com' })
	email: string;

	@IsOptional()
	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String, example: 'admin_gudang' })
	name: string;

	@IsOptional()
	@Validators.IsString({ message: 'nik harus string' })
	@Validators.IsNotEmpty({ message: 'nik tidak boleh kosong' })
	@ApiProperty({ description: 'nik', type: String, example: '13545464' })
	nik: string;

	@IsOptional()
	@Validators.IsString({ message: 'jabatan harus string' })
	@Validators.IsNotEmpty({ message: 'jabatan tidak boleh kosong' })
	@ApiProperty({ description: 'jabatan', type: String, example: 'staff finannce' })
	jabatan: string;

	@ApiPropertyOptional({ description: 'roles', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	roles?: string;
}

export class GetRolesDto {
	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	page?: number = 1;

	@IsOptional()
	@Transformers.Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
	@Type(() => Number)
	@IsNumber()
	limit?: number = 10;

	@IsOptional()
	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String, example: 'admin_gudang' })
	name: string;
}
