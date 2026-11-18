import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolePerimisionService } from './role-perimision.service';
import { CreateRolePerimisionDto } from './dto/create-role-perimision.dto';
import { UpdateRolePerimisionDto } from './dto/update-role-perimision.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('role-persmisions')
@ApiTags('Role Persmisions')
export class RolePerimisionController {
	constructor(private readonly rolePerimisionService: RolePerimisionService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create Role Permisions' })
	create(@Body() createRolePerimisionDto: CreateRolePerimisionDto) {
		return this.rolePerimisionService.create(createRolePerimisionDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get Role Permisions' })
	findAll() {
		return this.rolePerimisionService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rolePerimisionService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRolePerimisionDto: UpdateRolePerimisionDto) {
		return this.rolePerimisionService.update(+id, updateRolePerimisionDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.rolePerimisionService.remove(+id);
	}
}
