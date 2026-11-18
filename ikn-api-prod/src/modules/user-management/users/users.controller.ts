import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetRolesDto, GetUsertDto } from './dto/get-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('users')
@ApiTags('Users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create user' })
	@ApiBody({ type: CreateUserDto })
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get users' })
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Current page' })
	@ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
	@ApiQuery({ name: 'name', required: false, type: String, example: '', description: 'name keyword' })
	@ApiQuery({ name: 'email', required: false, type: String, example: '', description: 'email search' })
	@ApiQuery({ name: 'jabatan', required: false, type: String, example: '', description: 'jabatan search' })
	@ApiQuery({ name: 'nik', required: false, type: String, example: '', description: 'nik search' })
	findAll(@Query() query: GetUsertDto) {
		return this.usersService.findAll(query);
	}

	@Get('roles')
	@ApiBearerAuth()
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Current page' })
	@ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
	@ApiQuery({ name: 'name', required: false, type: String, example: '', description: 'name keyword' })
	@ApiOperation({ summary: 'GET roles' })
	async findRole(@Query() query: GetRolesDto) {
		return this.usersService.findRole(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET role and permision by id' })
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@Get(':id/permision')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET permision by id' })
	async findPermisionByIdRole(@Param('id') id: number) {
		return this.usersService.findPermisionByIdRole(+id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Soft delete users' })
	remove(@Param('id') id: string) {
		return this.usersService.softDeleteUser(id);
	}
}
