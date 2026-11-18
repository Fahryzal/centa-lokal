import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';

export class CreateOpeningBalanceDetailDto {
	@Validators.IsString({ message: 'unitId harus string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({ description: 'unitId', type: String, example: 'unitId' })
	unitId: string;

	@Validators.IsString({ message: 'accountCode harus string' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String, example: 'accountCode' })
	accountCode: string;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'debit tidak boleh kosong' })
	@ApiProperty({ description: 'debit', type: Number, example: 'debit' })
	debit: number;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'credit tidak boleh kosong' })
	@ApiProperty({ description: 'credit', type: Number, example: 'credit' })
	credit: number;

	@Validators.IsNotEmpty({ message: 'fiscalYear tidak boleh kosong' })
	@ApiProperty({ description: 'fiscalYear', type: String, example: 'fiscalYear' })
	fiscalYear: string;
}
export class CreateBankAccountDto {
	@Validators.IsString({ message: 'accountCode harus string' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode barang', type: String })
	accountCode: string;

	@Validators.IsString({ message: 'branchAddress harus string' })
	@Validators.IsNotEmpty({ message: 'branchAddress tidak boleh kosong' })
	@ApiProperty({ description: 'branchAddress barang', type: String })
	branchAddress: string;

	@Validators.IsString({ message: 'bankName harus string' })
	@Validators.IsNotEmpty({ message: 'bankName tidak boleh kosong' })
	@ApiProperty({ description: 'bankName', type: String })
	bankName: string;

	@Validators.IsString({ message: 'bankAccountNumbers harus string' })
	@Validators.IsNotEmpty({ message: 'bankAccountNumbers tidak boleh kosong' })
	@ApiProperty({ description: 'bankAccountNumbers', type: String })
	bankAccountNumber: string;

	@Validators.IsString({ message: 'unitIds harus string' })
	@Validators.IsNotEmpty({ message: 'bankCodes tidak boleh kosong' })
	@ApiProperty({ description: 'bankCodes', type: String })
	bankCode: string;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'initialBalance tidak boleh kosong' })
	@ApiProperty({ description: 'initialBalance', type: Number })
	initialBalance: number;

	@Validators.IsString()
	@Validators.IsNotEmpty({ message: 'dates tidak boleh kosong' })
	@ApiProperty({ description: 'dates', type: String })
	date: Date;

	@Validators.IsString({ message: 'unitIds harus string' })
	@Validators.IsNotEmpty({ message: 'unitIds tidak boleh kosong' })
	@ApiProperty({ description: 'unitIds', type: String })
	unitId: string;

	@Validators.ValidateNested()
	@Transformers.Type(() => CreateOpeningBalanceDetailDto)
	@ApiProperty({ type: [CreateOpeningBalanceDetailDto] })
	details: CreateOpeningBalanceDetailDto[];
}
