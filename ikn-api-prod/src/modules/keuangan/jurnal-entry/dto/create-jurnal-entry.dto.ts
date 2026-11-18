import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';
import { TypePenjualan } from '@prisma/client';

export class CreateJurnalEntryDetailsDto {
	@Validators.IsString({ message: 'unitId harus string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({ description: 'unitId', type: String, example: 'unitId' })
	unitId: string;

	@Validators.IsString({ message: 'accountCode harus string' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String, example: 'accountCode' })
	accountCode: string;

	@Validators.IsNumber()
	@Validators.IsOptional()
	@ApiProperty({ description: 'debit', type: Number, example: 'debit' })
	debit: number;

	@Validators.IsNumber()
	@Validators.IsOptional()
	@ApiProperty({ description: 'credit', type: Number, example: 'credit' })
	credit: number;

	@Validators.IsNumber()
	@Validators.IsOptional()
	@ApiProperty({ description: 'debitDollar', type: Number, example: 'debitDollar' })
	debitDollar: number;

	@Validators.IsNumber()
	@Validators.IsOptional()
	@ApiProperty({ description: 'creditDollar', type: Number, example: 'creditDollar' })
	creditDollar: number;

	@Validators.IsNumber()
	@Validators.IsOptional({ message: 'currencyValue tidak boleh kosong' })
	@ApiProperty({ description: 'currencyValue', type: Number })
	currencyValue: number;

	@Validators.IsOptional()
	@ApiProperty({ description: 'description', type: String, example: 'description' })
	description?: string;
}

export class CreateJurnalEntryDto {
	@Validators.IsString({ message: 'numberJurnal harus string' })
	@Validators.IsNotEmpty({ message: 'numberJurnal tidak boleh kosong' })
	@ApiProperty({ description: 'numberJurnal', type: String, example: 'numberJurnal' })
	numberJurnal: string;

	@Validators.IsString({ message: 'description harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'description', type: String, example: 'description' })
	description?: string;

	@Validators.IsOptional()
	@ApiProperty({ description: 'purposeTransaction', type: String, example: 'purposeTransaction' })
	purposeTransaction?: string;

	@Validators.IsOptional({ message: 'referenceNumber tidak boleh kosong' })
	@ApiProperty({ description: 'referenceNumber', type: String, example: 'referenceNumber' })
	referenceNumber: string;

	@Validators.IsNotEmpty({ message: 'date tidak boleh kosong' })
	@Validators.IsString()
	@ApiProperty({ description: 'date', type: String, example: 'date' })
	date: Date;

	@Validators.IsOptional({ message: 'currencyValue tidak boleh kosong' })
	@ApiProperty({ description: 'currencyValue', type: Number })
	@Validators.IsNumber()
	currencyValue: number;

	@Validators.IsOptional()
	@ApiProperty({ description: 'totalBalance', type: Number })
	@Validators.IsNumber()
	totalBalance: number;

	@Validators.IsOptional()
	@ApiProperty({ description: 'totalBalanceUs', type: Number })
	@Validators.IsNumber()
	totalBalanceUs: number;

	@Validators.IsString({ message: 'unitId harus string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({ description: 'unitId', type: String, example: 'unitId' })
	unitId: string;

	@Validators.IsString({ message: 'typeJournalEntry harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'typeJournalEntry', type: String, example: 'typeJournalEntry' })
	typeJournalEntry: TypePenjualan;

	@Validators.ValidateNested()
	@Transformers.Type(() => CreateJurnalEntryDetailsDto)
	@ApiProperty({ type: [CreateJurnalEntryDetailsDto] })
	details: CreateJurnalEntryDetailsDto[];
}
