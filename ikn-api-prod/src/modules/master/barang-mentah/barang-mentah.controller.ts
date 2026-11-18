import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BarangMentahService } from './barang-mentah.service';
import { CreateBarangMentahDto } from './dto/create-barang-mentah.dto';
import { UpdateBarangMentahDto } from './dto/update-barang-mentah.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBarangMentahDto } from './dto/get-barang-mentah.dto';
import { AuthGuard } from '@nestjs/passport';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('barang-mentah')
@ApiTags('Barang Mentah')
export class BarangMentahController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly barangMentahService: BarangMentahService
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create barang mentah / Penerimaan barang mentah' })
	@ApiBody({ type: CreateBarangMentahDto })
	create(@Body() createBarangMentahDto: CreateBarangMentahDto) {
		return this.barangMentahService.create(createBarangMentahDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET Barang mentah' })
	findAll(@Query() query: GetBarangMentahDto) {
		return this.barangMentahService.findAll(query);
	}

	@Get('/all')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET All Barang mentah' })
	getAllBarangMentah(@Req() req: Request, @Query() query: GetBarangMentahDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.barangMentahService.getAllBarangMentah(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth()
	findOne(@Param('id') id: string) {
		return this.barangMentahService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	update(@Param('id') id: string, @Body() updateBarangMentahDto: UpdateBarangMentahDto) {
		return this.barangMentahService.update(id, updateBarangMentahDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	remove(@Param('id') id: string) {
		return this.barangMentahService.remove(id);
	}
}
