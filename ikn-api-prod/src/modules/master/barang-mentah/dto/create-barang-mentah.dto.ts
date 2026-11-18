import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CreateBarangMentahDto {
	@Validators.IsString({ message: 'accountCode harus string' })
	@Validators.IsNotEmpty({ message: 'accountCode tidak boleh kosong' })
	@ApiProperty({ description: 'accountCode', type: String, example: 'accountCode' })
	accountCode: string;

	@Validators.IsString({ message: 'itemCode harus string' })
	@Validators.IsNotEmpty({ message: 'itemCode tidak boleh kosong' })
	@ApiProperty({ description: 'itemCode', type: String, example: 'itemCode' })
	itemCode: string;

	@Validators.IsString({ message: 'itemName harus string' })
	@Validators.IsNotEmpty({ message: 'itemName tidak boleh kosong' })
	@ApiProperty({ description: 'itemName', type: String, example: 'itemName' })
	itemName: string;

	@Validators.IsString({ message: 'satuan harus string' })
	@Validators.IsNotEmpty({ message: 'satuan tidak boleh kosong' })
	@ApiProperty({ description: 'satuan', type: String, example: 'satuan' })
	satuan: string;

	@Validators.IsString({ message: 'unitId harus string' })
	@Validators.IsNotEmpty({ message: 'unitId tidak boleh kosong' })
	@ApiProperty({ description: 'unitId', type: String, example: 'unitId' })
	unitId: string;
}
