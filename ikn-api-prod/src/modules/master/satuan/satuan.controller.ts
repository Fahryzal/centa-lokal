import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { SatuanService } from './satuan.service';
import { CreateSatuanDto } from './dto/create-satuan.dto';
import { UpdateSatuanDto } from './dto/update-satuan.dto';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { GetSatuantDto } from './dto/get-satuan.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('satuan')
@ApiTags('Satuan')
export class SatuanController {
	constructor(
		private readonly satuanService: SatuanService,
		private readonly helperGLobal: HelperGlobal
	) {}
	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create satuan' })
	@ApiBody({ type: CreateSatuanDto })
	create(@Req() req: Request, @Body() createSatuanDto: CreateSatuanDto) {
		const decoded = this.helperGLobal.decodeJwt(req);
		return this.satuanService.create(createSatuanDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET satuan' })
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Current page' })
	@ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
	@ApiQuery({ name: 'keterangan', required: false, type: String, example: '', description: 'unit keyword' })
	@ApiQuery({ name: 'kode', required: false, type: String, example: '', description: 'kode search' })
	findAll(@Query() query: GetSatuantDto) {
		return this.satuanService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET satuan by id' })
	findOne(@Param('id') id: string) {
		return this.satuanService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'UPDATE satuan by id' })
	update(@Param('id') id: string, @Body() updateSatuanDto: UpdateSatuanDto) {
		return this.satuanService.update(id, updateSatuanDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Soft DELETE satuan by id' })
	remove(@Param('id') id: string) {
		return this.satuanService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Restore satuan' })
	restore(@Param('id') id: string) {
		return this.satuanService.restore(id);
	}
}
