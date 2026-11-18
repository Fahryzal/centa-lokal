import { JwtStrategy } from '@modules/common/jwt.strategy';
import { PrismaService } from '@modules/common/prisma.service';
// import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FrontendErrorController } from './frontend-error.controller';
import { FrontendErrorService } from './frontend-error.service';

@Global()
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
	controllers: [FrontendErrorController],
	providers: [PrismaService, JwtStrategy, FrontendErrorService],
	exports: [JwtModule, PrismaService, JwtStrategy],
})
export class CommonModule {}
