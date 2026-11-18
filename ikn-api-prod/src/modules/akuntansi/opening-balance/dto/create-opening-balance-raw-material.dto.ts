import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import * as Validators from 'class-validator';

export class CreateOpeningBalanceRawMaterialItemsDto {
	@Validators.IsString({ message: 'itemCode tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'itemCode tidak boleh kosong' })
	@ApiProperty({ description: 'itemCode', type: String })
	itemCode: string;

	@Validators.IsString({ message: 'itemName tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'itemName tidak boleh kosong' })
	@ApiProperty({ description: 'itemName', type: String })
	itemName: string;

	@Validators.IsString({ message: 'unit tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'unit tidak boleh kosong' })
	@ApiProperty({ description: 'unit', type: String })
	unit: string;

	@Validators.IsString({ message: 'Satuan tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'Satuan tidak boleh kosong' })
	@ApiProperty({ description: 'Satuan', type: String })
	satuan: string;

	@Validators.IsNumber()
	@Type(() => Number)
	@Validators.IsNotEmpty({ message: 'nilaiSatuan tidak boleh kosong' })
	@ApiProperty({ description: 'nilaiSatuan', type: Number, example: 200 })
	nilaiSatuan: number;

	@Validators.IsNumber()
	@Type(() => Number)
	@Validators.IsNotEmpty({ message: 'quantity tidak boleh kosong' })
	@ApiProperty({ description: 'quantity', type: Number, example: 200 })
	quantity: number;

	@Validators.IsNumber()
	@Type(() => Number)
	@Validators.IsNotEmpty({ message: 'stok tidak boleh kosong' })
	@ApiProperty({ description: 'stok', type: Number, example: 200 })
	stok: number;

	@Validators.IsString({ message: 'accountCode tidak boleh kosong' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String })
	accountCode: string;

	@Validators.IsNumber()
	@Type(() => Number)
	@Validators.IsNotEmpty({ message: 'Total tidak boleh kosong' })
	@ApiProperty({ description: 'Total', type: Number, example: 200 })
	Total: number;

	@Validators.IsOptional({ message: 'id tidak boleh kosong' })
	@ApiProperty({ description: 'id', type: String })
	id: string;

	@Validators.IsOptional({ message: 'productId tidak boleh kosong' })
	@ApiProperty({ description: 'productId', type: String })
	productId: string;
}
