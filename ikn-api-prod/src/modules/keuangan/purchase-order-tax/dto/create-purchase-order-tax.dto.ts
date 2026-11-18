import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CreatePurchaseOrderTaxDto {
	@Validators.IsString({ message: 'spbId harus string' })
	@Validators.IsNotEmpty({ message: 'spbId tidak boleh kosong' })
	@ApiProperty({ description: 'spbId', type: String, example: 'uuid spbId' })
	spbId: string;

	@Validators.IsString({ message: 'taxId harus string' })
	@Validators.IsNotEmpty({ message: 'taxId tidak boleh kosong' })
	@ApiProperty({ description: 'taxId', type: String, example: 'uuid taxId' })
	taxId: string;

	@Validators.IsString({ message: 'taxType harus string' })
	@Validators.IsNotEmpty({ message: 'taxType tidak boleh kosong' })
	@ApiProperty({ description: 'taxType', type: String, example: 'uuid taxType' })
	taxType: string;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'taxValue tidak boleh kosong' })
	@ApiProperty({ description: 'taxValue', type: Number, example: 0 })
	taxValue: number;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'taxAmount tidak boleh kosong' })
	@ApiProperty({ description: 'taxAmount', type: Number, example: 0 })
	taxAmount: number;
}

export class ItemsDTO {
	@Validators.IsString({ message: 'productId harus string' })
	@Validators.IsNotEmpty({ message: 'productId tidak boleh kosong' })
	@ApiProperty({ description: 'productId', type: String, example: 'uuid productId' })
	productId: string;
}

export class BulkCreatePurchaseOrderTaxDto {
	@ApiProperty({ type: [CreatePurchaseOrderTaxDto] })
	@ValidateNested({ each: true })
	@Type(() => CreatePurchaseOrderTaxDto)
	taxes: CreatePurchaseOrderTaxDto[];

	@ApiProperty({ type: [ItemsDTO] })
	@ValidateNested({ each: true })
	@Type(() => ItemsDTO)
	item: ItemsDTO[];

	@Validators.IsString({ message: 'spbId harus string' })
	@Validators.IsNotEmpty({ message: 'spbId tidak boleh kosong' })
	@ApiProperty({ description: 'spbId', type: String, example: 'uuid spbId' })
	spbId: string;
	@Validators.IsString({ message: 'purchaseOrderId harus string' })
	@Validators.IsNotEmpty({ message: 'purchaseOrderId tidak boleh kosong' })
	@ApiProperty({ description: 'purchaseOrderId', type: String, example: 'uuid purchaseOrderId' })
	purchaseOrderId: string;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'totalAmounTax tidak boleh kosong' })
	@ApiProperty({ description: 'totalAmounTax', type: Number, example: 0 })
	totalAmounTax: number;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'totalAmount tidak boleh kosong' })
	@ApiProperty({ description: 'totalAmount', type: Number, example: 0 })
	totalAmount: number;

	@Validators.IsString({ message: 'orderNumber harus string' })
	@Validators.IsNotEmpty({ message: 'orderNumber tidak boleh kosong' })
	@ApiProperty({ description: 'orderNumber', type: String, example: 'uuid orderNumber' })
	orderNumber: string;
}
