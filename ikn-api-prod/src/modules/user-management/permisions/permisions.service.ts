import { Injectable, Scope } from '@nestjs/common';
import { CreatePermisionDto } from './dto/create-permision.dto';
import { UpdatePermisionDto } from './dto/update-permision.dto';
import { PrismaService } from '@src/modules/common/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class PermisionsService {
	constructor(private readonly prisma: PrismaService) {}
	create(createPermisionDto: CreatePermisionDto) {
		return this.prisma.permission.create({
			data: createPermisionDto,
		});
	}

	findAll() {
		return `This action returns all permisions`;
	}

	findOne(id: number) {
		return `This action returns a #${id} permision`;
	}

	update(id: number, updatePermisionDto: UpdatePermisionDto) {
		return `This action updates a #${id} permision`;
	}

	remove(id: number) {
		return `This action removes a #${id} permision`;
	}
}
