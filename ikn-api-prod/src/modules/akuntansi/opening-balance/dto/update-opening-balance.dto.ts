import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';
import { CreateOpeningBalanceRawMaterialItemsDto } from './create-opening-balance-raw-material.dto';

export class CreateOpeningBalanceDetailDto {
	@Validators.IsString({ message: 'id harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'id', type: String, example: 'id' })
	id: string;

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

export class UpdateOpeningBalanceDto {
	@Validators.IsString({ message: 'fiscalYear harus string' })
	@Validators.IsNotEmpty({ message: 'fiscalYear tidak boleh kosong' })
	@ApiProperty({ description: 'fiscalYear', type: String, example: 'fiscalYear' })
	fiscalYear: string;

	@Validators.IsString({ message: 'unitId harus string' })
	@Validators.IsNotEmpty()
	@ApiProperty({ description: 'unitId', type: String, example: 'unitId' })
	unitId: string;

	@Validators.IsString({ message: 'notes harus string' })
	@Validators.IsNotEmpty({ message: 'notes tidak boleh kosong' })
	@ApiProperty({ description: 'notes', type: String, example: 'notes' })
	notes: string;

	@Validators.IsString({ message: 'date harus string' })
	@Validators.IsNotEmpty({ message: 'date tidak boleh kosong' })
	@ApiProperty({ description: 'date', type: String, example: 'date' })
	date: string;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'totalBalance tidak boleh kosong' })
	@ApiProperty({ description: 'totalBalance', type: Number, example: 'totalBalance' })
	totalBalance: number;

	@Validators.ValidateNested()
	@Transformers.Type(() => CreateOpeningBalanceDetailDto)
	@ApiProperty({ type: [CreateOpeningBalanceDetailDto] })
	details: CreateOpeningBalanceDetailDto[];

	@Validators.ValidateNested()
	@Transformers.Type(() => CreateOpeningBalanceRawMaterialItemsDto)
	@ApiProperty({ type: [CreateOpeningBalanceRawMaterialItemsDto] })
	@Validators.IsOptional()
	rawmItems: CreateOpeningBalanceRawMaterialItemsDto[];
}
