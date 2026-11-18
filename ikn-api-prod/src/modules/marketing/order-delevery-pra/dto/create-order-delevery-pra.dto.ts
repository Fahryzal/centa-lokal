import { ApiProperty } from '@nestjs/swagger';
import { DeliveryOrderStatus, TypePenjualan } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import * as Validators from 'class-validator';

export class CreateDeliveryOrderItemDto {
	@Validators.IsString()
	@Validators.IsNotEmpty()
	purchaseOrderItemId: string;

	@Transform(({ value }) => {
		if (typeof value === 'string') {
			const normalized = value.trim().replace(',', '.');
			return normalized === '' ? value : Number(normalized);
		}

		return value;
	})
	@Validators.IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'qtyKirim harus berupa angka yang valid' })
	@Validators.Min(0.01, {
		message: 'qtyKirim harus lebih dari 0',
	})
	qtyKirim: number;
}

export class CreateOrderDeleveryPraDto {
	@Validators.IsString({ message: 'purchaseOrderId harus string' })
	@Validators.IsNotEmpty({ message: 'purchaseOrderId tidak boleh kosong' })
	@ApiProperty({
		description: 'purchaseOrderId',
		type: String,
		example: 'uuid purchase order',
	})
	purchaseOrderId: string;

	@Validators.IsString()
	@Validators.IsOptional()
	@ApiProperty({
		description: 'status',
		type: String,
		example: 'PENDING',
	})
	status: DeliveryOrderStatus;

	@Validators.IsString({ message: 'typeSalesDelivery harus string' })
	@Validators.IsNotEmpty({ message: 'typeSalesDelivery harus string' })
	@ApiProperty({
		description: 'typeSalesDelivery',
		type: String,
		example: 'RA | RN',
	})
	typeSalesDelivery: TypePenjualan;

	@Validators.IsString({ message: 'au58Number harus string' })
	@Validators.IsOptional()
	@ApiProperty({
		description: 'Nomor AU58',
		type: String,
		required: false,
		nullable: true,
		example: 'AU58-001',
	})
	au58Number?: string | null;

	@Validators.IsOptional()
	@Type(() => Date)
	@Validators.IsDate({
		message: 'au58Date harus berupa tanggal yang valid',
	})
	@ApiProperty({
		description: 'Tanggal AU58',
		type: Date,
		required: false,
		nullable: true,
		example: '2026-09-10T00:00:00.000Z',
	})
	au58Date?: Date | null;

	@Validators.IsOptional()
	@Validators.IsArray()
	@Validators.ValidateNested({ each: true })
	@Type(() => CreateDeliveryOrderItemDto)
	items?: CreateDeliveryOrderItemDto[];
}
