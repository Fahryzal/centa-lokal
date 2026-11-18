import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import { TypePenjualan, SalesPlanStatus } from '@prisma/client';

export class CreateSalesPlanDto {
	@Validators.IsString({ message: 'description harus string' })
	@Validators.IsNotEmpty({ message: 'description tidak boleh kosong' })
	@ApiProperty({ description: 'description', type: String, example: 'description' })
	description: string;

	@Validators.IsString({ message: 'staffId harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'staffId', type: String, example: '2d9fabab-ae48-4b89-bfdb-83d9c71c0ed9' })
	staffId: string;

	@ApiProperty({ description: 'status', type: String, example: 'PENDING' })
	status: SalesPlanStatus;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'rkap tidak boleh kosong' })
	@ApiProperty({ description: 'rkap', type: Number, example: 1000 })
	value_rkap: number;

	@Validators.IsString({ message: 'periode bulan harus string' })
	@Validators.IsNotEmpty({ message: 'periode bulan tidak boleh kosong' })
	@ApiProperty({ description: 'periode bulan', type: String, example: '04/2025' })
	periode_month: string;

	@Validators.IsString({ message: 'typeSalesPlan harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'typeSalesPlan', type: String, example: 'typeJournalEntry' })
	typeSalesPlan: TypePenjualan;

	@Validators.IsString({ message: 'unitId bulan harus string' })
	@Validators.IsNotEmpty({ message: 'unitId bulan tidak boleh kosong' })
	@ApiProperty({ description: 'unitId bulan', type: String, example: '04/2025' })
	unitId: string;
}
