import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
export class UpdateJurnalEntryDetailsDto {
	@Validators.IsOptional()
	@ApiProperty({ description: 'id', type: String, example: 'uuid' })
	@Validators.IsString()
	id: string;

	@Validators.IsString({ message: 'accountCode harus string' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String, example: 'uuid' })
	@Validators.IsString()
	accountCode: string;

	@Validators.IsNotEmpty({ message: 'credit tidak boleh kosong' })
	@ApiProperty({ description: 'credit', type: Number })
	@Validators.IsNumber()
	credit: number;

	@Validators.IsNotEmpty({ message: 'debit tidak boleh kosong' })
	@ApiProperty({ description: 'debit', type: Number })
	@Validators.IsNumber()
	debit: number;

	@Validators.IsNotEmpty({ message: 'creditDollar tidak boleh kosong' })
	@ApiProperty({ description: 'creditDollar', type: Number })
	@Validators.IsNumber()
	creditDollar: number;

	@Validators.IsNotEmpty({ message: 'debitDollar tidak boleh kosong' })
	@ApiProperty({ description: 'debitDollar', type: Number })
	@Validators.IsNumber()
	debitDollar: number;

	@Validators.IsOptional()
	@ApiProperty({ description: 'journalEntryId', type: String })
	@Validators.IsString()
	journalEntryId: string;

	@Validators.IsNotEmpty({ message: 'unit tidak boleh kosong' })
	@ApiProperty({ description: 'unit', type: String })
	@Validators.IsString()
	unitId: string;

	@Validators.IsOptional()
	@ApiProperty({ description: 'deletedAt', type: String })
	@Validators.IsString()
	deletedAt: string;

	@Validators.IsNotEmpty({ message: 'currencyValue tidak boleh kosong' })
	@ApiProperty({ description: 'currencyValue', type: Number })
	@Validators.IsNumber()
	currencyValue: number;

	@Validators.IsOptional()
	@ApiProperty({ description: 'fixedAssetId', type: String })
	@Validators.IsString()
	fixedAssetId: string;

	@Validators.IsOptional()
	@ApiProperty({ description: 'description', type: String, example: 'description' })
	description?: string;
}

export class UpdateteJurnalEntryDto {
	@Validators.IsString({ message: 'numberJurnal harus string' })
	@Validators.IsNotEmpty({ message: 'numberJurnal tidak boleh kosong' })
	@ApiProperty({ description: 'numberJurnal', type: String, example: 'numberJurnal' })
	numberJurnal: string;

	@Validators.IsString({ message: 'createdBy harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'createdBy', type: String, example: 'createdBy' })
	createdBy: string;

	@Validators.IsString({ message: 'description harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'description', type: String, example: 'description' })
	description?: string;

	@Validators.IsOptional({ message: 'referenceNumber tidak boleh kosong' })
	@ApiProperty({ description: 'referenceNumber', type: String, example: 'referenceNumber' })
	referenceNumber: string;

	@Validators.IsNotEmpty({ message: 'date tidak boleh kosong' })
	@Validators.IsString()
	@ApiProperty({ description: 'date', type: String, example: 'date' })
	date: Date;

	@Validators.IsString({ message: 'unitId harus string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({ description: 'unitId', type: String, example: 'unitId' })
	unitId: string;

	@Validators.IsOptional({ message: 'currencyValue tidak boleh kosong' })
	@ApiProperty({ description: 'currencyValue', type: Number })
	@Validators.IsNumber()
	currencyValue: number;

	@Validators.IsOptional({ message: 'totalBalance tidak boleh kosong' })
	@ApiProperty({ description: 'totalBalance', type: Number })
	@Validators.IsNumber()
	totalBalance: number;

	@Validators.IsOptional({ message: 'totalBalanceUs tidak boleh kosong' })
	@ApiProperty({ description: 'totalBalanceUs', type: Number })
	@Validators.IsNumber()
	totalBalanceUs: number;

	@Validators.IsString({ message: 'purposeTransaction harus string' })
	@ApiProperty({ description: 'purposeTransaction', type: String, example: 'purposeTransaction' })
	@Validators.IsOptional()
	purposeTransaction?: string;

	@Validators.ValidateNested()
	@Transformers.Type(() => UpdateJurnalEntryDetailsDto)
	@ApiProperty({ type: [UpdateJurnalEntryDetailsDto] })
	details: UpdateJurnalEntryDetailsDto[];
}
