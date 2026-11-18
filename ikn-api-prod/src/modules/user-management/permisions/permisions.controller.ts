import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermisionsService } from './permisions.service';
import { CreatePermisionDto } from './dto/create-permision.dto';
import { UpdatePermisionDto } from './dto/update-permision.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('permisions')
@ApiTags('Permisions')
export class PermisionsController {
	constructor(private readonly permisionsService: PermisionsService) {}

	@Post()
	@ApiOperation({ summary: 'Create permisions' })
	@ApiBearerAuth()
	create(@Body() createPermisionDto: CreatePermisionDto) {
		return this.permisionsService.create(createPermisionDto);
	}

	@Get()
	@ApiOperation({ summary: 'Create permisions' })
	@ApiBearerAuth()
	findAll() {
		return this.permisionsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Create permisions' })
	@ApiBearerAuth()
	findOne(@Param('id') id: string) {
		return this.permisionsService.findOne(+id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Create permisions' })
	@ApiBearerAuth()
	update(@Param('id') id: string, @Body() updatePermisionDto: UpdatePermisionDto) {
		return this.permisionsService.update(+id, updatePermisionDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Create permisions' })
	@ApiBearerAuth()
	remove(@Param('id') id: string) {
		return this.permisionsService.remove(+id);
	}
}
