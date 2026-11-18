import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMenuDto } from './dto/get-menu.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('menus')
@ApiTags('Menus')
export class MenusController {
	constructor(private readonly menusService: MenusService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create Menus' })
	create(@Body() createMenuDto: CreateMenuDto) {
		return this.menusService.create(createMenuDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get Menus' })
	findAll(@Query() query: GetMenuDto) {
		return this.menusService.findAll(query);
	}

	@Get('/by-group')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get Menus By group' })
	findAllByGroup() {
		return this.menusService.findAllByGroup();
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'findOne Menu' })
	findOne(@Param('id') id: string) {
		return this.menusService.findOne(+id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update Menus by Id' })
	update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
		return this.menusService.update(+id, updateMenuDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete Menus' })
	remove(@Param('id') id: number) {
		return this.menusService.remove(id);
	}
}
