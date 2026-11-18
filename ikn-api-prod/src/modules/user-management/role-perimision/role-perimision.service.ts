import { Injectable } from '@nestjs/common';
import { CreateRolePerimisionDto } from './dto/create-role-perimision.dto';
import { UpdateRolePerimisionDto } from './dto/update-role-perimision.dto';
import { PrismaService } from '@src/modules/common/prisma.service';

@Injectable()
export class RolePerimisionService {
	constructor(private readonly prisma: PrismaService) {}
	create(createRolePerimisionDto: CreateRolePerimisionDto) {
		return this.prisma.rolePermission.create({
			data: {
				roleId: createRolePerimisionDto.roleId,
				// permissionId: createRolePerimisionDto.permissionId,
				menuId: createRolePerimisionDto.menuId,
				canView: createRolePerimisionDto.canView ?? false,
				canAdd: createRolePerimisionDto.canAdd ?? false,
				canEdit: createRolePerimisionDto.canEdit ?? false,
				canDelete: createRolePerimisionDto.canDelete ?? false,
				canApprove: createRolePerimisionDto.canApprove ?? false,
			},
		});
	}

	findAll() {
		return this.prisma.rolePermission.findMany();
	}

	findOne(id: number) {
		return `This action returns a #${id} rolePerimision`;
	}

	update(id: number, updateRolePerimisionDto: UpdateRolePerimisionDto) {
		return `This action updates a #${id} rolePerimision`;
	}

	remove(id: number) {
		return `This action removes a #${id} rolePerimision`;
	}
}
