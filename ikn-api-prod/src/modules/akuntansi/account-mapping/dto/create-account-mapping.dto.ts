import { Module, TransactionTypeMapping } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreateAccountMappingDto {
	@Validators.IsString({ message: 'module tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'module tidak boleh kosong' })
	@ApiProperty({ description: 'module', type: String })
	module: Module;

	@Validators.IsString({ message: 'transactionType tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'transactionType tidak boleh kosong' })
	@ApiProperty({ description: 'transactionType', type: String })
	transactionType: TransactionTypeMapping;

	@Validators.IsString({ message: 'position tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'position tidak boleh kosong' })
	@ApiProperty({ description: 'position', type: String })
	position: 'DEBIT' | 'CREDIT';

	@Validators.IsString({ message: 'usage tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'usage tidak boleh kosong' })
	@ApiProperty({ description: 'usage', type: String })
	usage: string;

	@Validators.IsString({ message: 'accountCode tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String })
	accountCode: string;
}
