import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import { Islocked } from '@prisma/client';

export class CreateAccountDto {
	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String })
	name: string;

	@Validators.IsString({ message: 'accountTypeId harus string' })
	@Validators.IsNotEmpty({ message: 'accountTypeId tidak boleh kosong' })
	@ApiProperty({ description: 'accountTypeId', type: String })
	accountTypeId: string;

	@Validators.IsString({ message: 'parentId harus string' })
	@ApiProperty({ description: 'parentId', type: String })
	@IsOptional()
	@IsString()
	parentId?: string;

	@Validators.IsString({ message: 'parentName harus string' })
	@ApiProperty({ description: 'parentName', type: String })
	@IsOptional()
	@IsString()
	parentName?: string;

	@Validators.IsString({ message: 'code harus string' })
	@Validators.IsNotEmpty({ message: 'code tidak boleh kosong' })
	@ApiProperty({ description: 'code', type: String })
	code: string;

	@Validators.IsString({ message: 'typeNeraca harus string' })
	@Validators.IsNotEmpty({ message: 'typeNeraca tidak boleh kosong' })
	@ApiProperty({ description: 'typeNeraca', type: String })
	typeNeraca: string;

	@Validators.IsString({ message: 'isLocked harus string' })
	@Validators.IsNotEmpty({ message: 'isLocked tidak boleh kosong' })
	@ApiProperty({ description: 'isLocked', type: String })
	isLocked: Islocked;
}
