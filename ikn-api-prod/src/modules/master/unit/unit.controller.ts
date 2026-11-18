import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GetUnitDto } from './dto/get-unit.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('unit')
@ApiTags('Unit')
export class UnitController {
	constructor(
		private readonly unitService: UnitService,
		private readonly helperGlobal: HelperGlobal
	) {}

	@Post()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create unit' })
	@ApiBody({ type: CreateUnitDto })
	create(@Req() req: Request, @Body() createUnitDto: CreateUnitDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.unitService.create(createUnitDto, decoded);
	}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get unit' })
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Current page' })
	@ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
	@ApiQuery({ name: 'nama', required: false, type: String, example: '', description: 'unit keyword' })
	@ApiQuery({ name: 'kode', required: false, type: String, example: '', description: 'kode search' })
	findAll(@Req() req: Request, @Query() query: GetUnitDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.unitService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'GET unit by id' })
	findOne(@Param('id') id: string) {
		return this.unitService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Update unit' })
	update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
		return this.unitService.update(id, updateUnitDto);
	}

	@Delete(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Soft delete unit' })
	remove(@Param('id') id: string) {
		return this.unitService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Restore unit' })
	restore(@Param('id') id: string) {
		return this.unitService.restore(id);
	}
}
