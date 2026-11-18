import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BarangJadiService } from './barang-jadi.service';
import { CreateBarangJadiDto } from './dto/create-barang-jadi.dto';
import { UpdateBarangJadiDto } from './dto/update-barang-jadi.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBarangjadiDto } from './dto/get-barang-jadi.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('barang-jadi')
@ApiTags('Barang Jadi')
export class BarangJadiController {
	constructor(
		private readonly helperGLobal: HelperGlobal,
		private readonly barangJadiService: BarangJadiService
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create barang jadi' })
	@ApiBody({ type: CreateBarangJadiDto })
	create(@Req() req: Request, @Body() createBarangJadiDto: CreateBarangJadiDto) {
		const decoded = this.helperGLobal.decodeJwt(req);
		return this.barangJadiService.create(createBarangJadiDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET barang jadi' })
	findAll(@Query() query: GetBarangjadiDto) {
		return this.barangJadiService.findAll(query);
	}

	@Get('/all')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET All Barang Jadi' })
	getAllBarangJadi(@Req() req: Request, @Query() query: GetBarangjadiDto) {
		const decoded = this.helperGLobal.decodeJwt(req);
		return this.barangJadiService.getAllBarangJadi(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET barang jadi by id' })
	findOne(@Param('id') id: string) {
		return this.barangJadiService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'UPDATE barang jadi by id' })
	update(@Param('id') id: string, @Body() updateBarangJadiDto: UpdateBarangJadiDto) {
		return this.barangJadiService.update(id, updateBarangJadiDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'SOFT DELETE barang jadi by id' })
	remove(@Param('id') id: string) {
		return this.barangJadiService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Restore barang jadi' })
	restore(@Param('id') id: string) {
		return this.barangJadiService.restore(id);
	}
}
