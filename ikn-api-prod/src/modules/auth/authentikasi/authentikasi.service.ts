import { CreateAuthentikasiDto } from './dto/create-authentikasi.dto';
import { UpdateAuthentikasiDto } from './dto/update-authentikasi.dto';
import { Injectable, UnauthorizedException, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/user-management/users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/Login-authentikasi.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/modules/common/prisma.service';
import axios from 'axios';

@Injectable({ scope: Scope.REQUEST })
export class AuthentikasiService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
		private readonly prisma: PrismaService
	) {}

	async validateUser(LoginDto: LoginDto): Promise<any> {
		const user = await this.userService.findByUserName(LoginDto.username);

		if (user && bcrypt.compareSync(LoginDto.password, user.password)) {
			const userWithRole = {
				...user,
				roles: user.roles.map((item) => item.role.name),
			};
			const { password, ...result } = userWithRole; // Exclude password from returned user object
			return result;
		}
		return null;
	}

	async generateAccessToken(user: LoginDto) {
		return {
			access_token: this.jwtService.sign(user, { secret: this.config.get<string>('JWT_SECRET') }),
		};
	}

	async generateRefreshToken(users: LoginDto) {
		const { password, ...result } = users; // Exclude password from returned user object

		const refreshToken = this.jwtService.sign(result, {
			secret: this.config.get<string>('JWT_REFRESH_SECRET'),
			expiresIn: this.config.get<string>('JWT_EXPIRES_RERESh_TOKEN'),
		});
		return {
			refresh_token: refreshToken,
		};
	}

	async validateRefreshToken(userId: string, refreshToken: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return bcrypt.compare(refreshToken, user.refreshToken);
	}

	async compareRefreshToken(providedToken: string, storedHashedToken: string): Promise<boolean> {
		if (!storedHashedToken) return false;
		try {
			return await bcrypt.compare(providedToken, storedHashedToken);
		} catch (error) {
			return false;
		}
	}

	async verifyRecaptcha(token: string) {
		const res = await axios.post(this.config.get<string>('DOMAIN_CAPTCHA'), null, {
			params: {
				secret: this.config.get<string>('RECAPTCHA_SECRET_KEY'),
				response: token,
			},
		});

		if (!res.data.success) {
			throw new UnauthorizedException('reCAPTCHA verification failed');
		}
	}

	async login(user: LoginDto) {
		await this.verifyRecaptcha(user.recaptchaToken);
		const refreshToken = await this.generateRefreshToken(user);
		const hashedRefreshToken = await bcrypt.hash(refreshToken.refresh_token, 10);
		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				refreshToken: hashedRefreshToken,
			},
		});
		const accessToken = await this.generateAccessToken(user);
		return {
			data: {
				...accessToken,
			},
			refresh_token: { ...refreshToken },
		};
	}
}
