import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import * as Validators from 'class-validator';
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateOrderDeleveryPraItemDto {
	@ApiProperty({
		description: 'ID item Purchase Order',
		example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
	})
	@IsString()
	@IsNotEmpty()
	purchaseOrderItemId: string;

	@ApiProperty({
		description: 'Quantity yang dikirim',
		example: 50,
	})
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

export class UpdateOrderDeleveryPraDto {
	@ApiPropertyOptional({
		description: 'Nomor dokumen AU58',
		example: 'AU58-001',
		nullable: true,
	})
	@IsOptional()
	@IsString()
	au58Number?: string | null;

	@ApiPropertyOptional({
		description: 'Tanggal AU58',
		example: '2026-09-30',
		nullable: true,
	})
	@IsOptional()
	@IsDateString()
	au58Date?: string | null;

	@ApiPropertyOptional({
		description: 'Item Delivery Order RA',
		type: [UpdateOrderDeleveryPraItemDto],
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateOrderDeleveryPraItemDto)
	items?: UpdateOrderDeleveryPraItemDto[];
}
