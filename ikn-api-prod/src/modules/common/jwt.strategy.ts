import { PrismaService } from '@modules/common/prisma.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		config: ConfigService
		// private readonly prisma: PrismaService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('JWT_SECRET'),
		});
	}

	async validate(payload: ResponseJwtType) {
		if (!payload) {
			throw new UnauthorizedException();
		}
		return payload; // atau isi lainnya
	}
}

export interface ResponseJwtType {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
	nik: string;
	jabatan: string;
	deletedAt: null;
	roles: string[];
	iat: number;
	exp: number;
}
