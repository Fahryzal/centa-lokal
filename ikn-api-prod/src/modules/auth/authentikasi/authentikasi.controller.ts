import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { PrismaService } from '@src/modules/common/prisma.service';
import { UsersService } from '@src/modules/user-management/users/users.service';
import { Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { AuthentikasiService } from './authentikasi.service';
import { LogOutTokenDto } from './dto/create-authentikasi.dto';
import { LoginDto } from './dto/Login-authentikasi.dto';

export interface DecodeTokenType {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
	nik: string;
	jabatan: string;
	refreshToken: null;
	deletedAt: null;
	roles: string[];
	recaptchaToken: string;
	unitId: string;
	isPusat: boolean;
	isRoot: string;
}

@Controller({ version: '1' })
@SetModuleName('authentikasi')
@ApiTags('Auth')
export class AuthentikasiController {
	constructor(
		private readonly authService: AuthentikasiService,
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
		private readonly usersService: UsersService,
	) {}

	@Post()
	@ApiOperation({ summary: 'Login users' })
	@ApiBody({ type: LoginDto })
	async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
		const user = await this.authService.validateUser(body);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		const result = await this.authService.login({
			...user,
			recaptchaToken: body.recaptchaToken,
		});
		res.cookie('refresh_token', result.refresh_token.refresh_token, {
			httpOnly: true,
			// secure: process.env.NODE_ENV === 'production',
			// sameSite: 'strict',
			maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
		});
		return {
			data: result.data,
		};
	}

	@Get('refresh')
	@ApiOperation({ summary: 'Refresh access token using refresh token' })
	@ApiResponse({ status: 201, description: 'New access token generated' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async refresh(@Req() req: any) {
		const refreshToken = req.cookies['refresh_token'];
		const token: any = jwtDecode(refreshToken || '-');
		try {
			const user = await this.prisma.user.findUnique({
				include: {
					roles: {
						include: {
							role: true,
						},
					},
				},
				where: {
					id: token.id,
				},
			});
			const userWithRole = {
				...user,
				roles: user.roles.map((item) => item.role.name),
			};
			const { password, ...result } = userWithRole; // Exclude password from returned user object

			if (!user) {
				throw new UnauthorizedException('User not found or token missing');
			}

			const isMatch = await this.authService.compareRefreshToken(refreshToken, user.refreshToken);
			if (!isMatch) {
				throw new UnauthorizedException('Invalid refresh token');
			}
			this.jwtService.verify(refreshToken, {
				secret: this.config.get<string>('JWT_REFRESH_SECRET'),
			});
			const accessToken = await this.authService.generateAccessToken(result as any);
			return {
				access_token: accessToken.access_token,
			};
		} catch (err) {
			if (err.name === 'TokenExpiredError') {
				throw new UnauthorizedException('Refresh token expired');
			}
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	@Post('logout')
	@HttpCode(200)
	@ApiBody({ type: LogOutTokenDto })
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Logout and clear refresh token' })
	async logout(@Body() body: { userId: string }) {
		const user = body.userId;

		await this.prisma.user.update({
			where: { id: user },
			data: { refreshToken: null }, // hapus token di DB
		});

		return { message: 'Logged out successfully' };
	}

	@Get('me')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'profile and hak access' })
	async getMe(@Req() req: any) {
		const authHeader = req.headers['authorization'] || '';
		const token = authHeader.replace('Bearer ', '');
		const decoded: DecodeTokenType = jwtDecode(token);
		const user = await this.usersService.findByIdWithRoles(decoded.id);

		if (!user) {
			throw new UnauthorizedException();
		}

		const roleIds = user.roles?.map((r) => r.roleId);
		const rolePermissions = await this.prisma.rolePermission.findMany({
			where: { roleId: { in: roleIds } },
			include: {
				menu: true,
				// permission: true
			},
		});

		// Step 1: Kelompokkan semua permission berdasarkan menuId
		const menuMap = new Map<
			number,
			{
				id: number;
				name: string;
				path: string;
				parentId: number | null;
				actions: {
					view: boolean;
					add: boolean;
					edit: boolean;
					delete: boolean;
					approve: boolean;
				};
			}
		>();

		for (const rp of rolePermissions) {
			const menu = rp.menu;
			if (!menuMap.has(menu.id)) {
				menuMap.set(menu.id, {
					id: menu.id,
					name: menu.name,
					path: menu.path,
					parentId: menu.parentId ?? null,
					actions: {
						view: false,
						add: false,
						edit: false,
						delete: false,
						approve: false,
					},
				});
			}

			const menuItem = menuMap.get(menu.id);
			if (rp.canView) menuItem.actions.view = true;
			if (rp.canAdd) menuItem.actions.add = true;
			if (rp.canEdit) menuItem.actions.edit = true;
			if (rp.canDelete) menuItem.actions.delete = true;
			if (rp.canApprove) menuItem.actions.approve = true;
		}

		// Step 2: Bentuk struktur parent-child
		const flatMenus = Array.from(menuMap.values());
		const grouped: Record<number, any[]> = {};
		const result: any[] = [];

		for (const menu of flatMenus) {
			if (menu.parentId) {
				if (!grouped[menu.parentId]) grouped[menu.parentId] = [];
				grouped[menu.parentId].push({
					menu: menu.name,
					path: menu.path,
					actions: menu.actions,
				});
			}
		}

		for (const menu of flatMenus) {
			if (!menu.parentId) {
				result.push({
					menu: menu.name,
					children: grouped[menu.id] || [],
				});
			}
		}

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				isPusat: user.isPusat,
				isRoot: user.isRoot,
			},
			unit: user.unit,
			menuAccess: result,
		};
	}
}
