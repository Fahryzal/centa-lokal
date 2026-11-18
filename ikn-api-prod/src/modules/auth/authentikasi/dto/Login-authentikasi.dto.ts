import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';

export class LoginDto {
	@Validators.IsString({ message: 'username harus string' })
	@Validators.IsNotEmpty({ message: 'username tidak boleh kosong' })
	@ApiProperty({ description: 'username', type: String, example: 'admin' })
	username: string;

	@Validators.IsString({ message: 'password harus string' })
	@Validators.IsNotEmpty({ message: 'password tidak boleh kosong' })
	@ApiProperty({ description: 'password', type: String, example: '12345' })
	password: string;

	@Validators.IsString({ message: 'recaptchaToken harus string' })
	@Validators.IsNotEmpty({ message: 'recaptchaToken tidak boleh kosong' })
	@ApiProperty({ description: 'recaptchaToken', type: String })
	recaptchaToken: string;

	id: string;
}
