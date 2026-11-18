import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreatePermisionDto {
	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String, example: 'ikn@gmail.com' })
	name: string;
}
