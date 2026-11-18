import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';

export class UpdateFIleBLOrderPoPraDto {
	@Validators.IsString({ message: 'fileUrlBl harus string' })
	@Validators.IsNotEmpty({ message: 'fileUrlBl tidak boleh kosong' })
	@ApiProperty({ description: 'fileUrlBl', type: String, example: 'ODR-0001' })
	fileUrlBl: string;
}
