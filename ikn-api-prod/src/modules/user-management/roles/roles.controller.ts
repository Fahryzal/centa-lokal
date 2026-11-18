import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRolesDto } from './dto/get-roles.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('roles')
@ApiTags('Roles')
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create roles' })
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get roles' })
	findAll(@Query() query: GetRolesDto) {
		return this.rolesService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'get roles by Id' })
	findOne(@Param('id') id: string) {
		return this.rolesService.findOne(+id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'update roles' })
	update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.rolesService.update(+id, updateRoleDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete roles' })
	remove(@Param('id') id: string) {
		return this.rolesService.remove(+id);
	}
}
