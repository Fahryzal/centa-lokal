import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthentikasiDto {}

export class RefreshTokenDto {
	@ApiProperty({ example: 'user-uuid-123', description: 'ID dari user' })
	userId: string;

	@ApiProperty({ example: 'refresh-token-string', description: 'Refresh token yang didapat saat login' })
	refreshToken: string;
}

export class LogOutTokenDto {
	@ApiProperty({ example: 'user-uuid-123', description: 'ID dari user' })
	userId: string;
}
