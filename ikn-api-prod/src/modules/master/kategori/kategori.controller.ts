import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GetKategoriDto } from './dto/get-kategori.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';
import { Request } from 'express';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('kategori')
@ApiTags('Kategori')
export class KategoriController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly kategoriService: KategoriService
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create kategori' })
	@ApiBody({ type: CreateKategoriDto })
	create(@Req() req: Request, @Body() createKategoriDto: CreateKategoriDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.kategoriService.create(createKategoriDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET kategori' })
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Current page' })
	@ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
	@ApiQuery({ name: 'nama', required: false, type: String, example: '', description: 'unit keyword' })
	@ApiQuery({ name: 'kode', required: false, type: String, example: '', description: 'kode search' })
	findAll(@Query() query: GetKategoriDto) {
		return this.kategoriService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET Unit By Id' })
	findOne(@Param('id') id: string) {
		return this.kategoriService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update Katgeri' })
	update(@Param('id') id: string, @Body() updateKategoriDto: UpdateKategoriDto) {
		return this.kategoriService.update(id, updateKategoriDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Soft delete kategori' })
	remove(@Param('id') id: string) {
		return this.kategoriService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Restore ketegoari' })
	restore(@Param('id') id: string) {
		return this.kategoriService.restore(id);
	}
}
