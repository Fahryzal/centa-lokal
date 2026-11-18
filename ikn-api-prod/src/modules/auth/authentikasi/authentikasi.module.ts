import { Module } from '@nestjs/common';
import { AuthentikasiService } from './authentikasi.service';
import { AuthentikasiController } from './authentikasi.controller';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '@src/shared/utils/constants';
import { UsersService } from '@src/modules/user-management/users/users.service';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
			}),
		}),
	],
	controllers: [AuthentikasiController],
	providers: [AuthentikasiService, UsersService],
})
export class AuthentikasiModule {}
