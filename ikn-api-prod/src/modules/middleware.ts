import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from './common/prisma.service';
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private prisma: PrismaService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!requiredRoles) return true;

		const request = context.switchToHttp().getRequest();
		const userId = request.user?.id;
		if (!userId) throw new ForbiddenException('User not authenticated');

		const userRoles = await this.prisma.userRole.findMany({
			where: { userId },
			include: { role: true },
		});

		const hasRole = userRoles.some(({ role }) => requiredRoles.includes(role.name));
		if (!hasRole) throw new ForbiddenException('Access denied');

		return true;
	}
}
