import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreateOpeningBalancePosDto {
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
}
