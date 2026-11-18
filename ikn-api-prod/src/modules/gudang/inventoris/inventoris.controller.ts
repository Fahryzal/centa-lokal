import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { Request } from 'express';
import { CreateInventorisDto } from './dto/create-inventoris.dto';
import { GetInventorisDto, GetKartuGudangProductDto } from './dto/get-inventoris.dto';
import { UpdateInventorisDto } from './dto/update-inventoris.dto';
import { InventorisService } from './inventoris.service';
@Controller({ version: '1' })
@SetModuleName('Inventori')
@UseGuards(AuthGuard('jwt')) //+
@ApiTags('Inventori')
export class InventorisController {
	constructor(
		private readonly inventorisService: InventorisService,
		private readonly helperGlobal: HelperGlobal,
	) {}

	@Post()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create Product/penerimaan barang hasil produksi' })
	@ApiBody({ type: CreateInventorisDto })
	create(@Req() req: Request, @Body() createInventorisDto: CreateInventorisDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.inventorisService.create(createInventorisDto, decoded.id);
	}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Product/penerimaan barang hasil produksi' })
	findAll(@Req() req: Request, @Query() query: GetInventorisDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.inventorisService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Product/penerimaan barang hasil produksi by id' })
	findOne(@Param('id') id: string) {
		return this.inventorisService.findOne(id);
	}

	@Get('/product-card-ware-house/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get Product/penerimaan for kartu gudang' })
	findOneProduct(@Param('id') id: string, @Query() year: GetKartuGudangProductDto) {
		return this.inventorisService.findOneProduct(id, year);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update penerimaan barang jadi berstatus DRAFT' })
	@ApiBody({ type: UpdateInventorisDto })
	update(@Param('id') id: string, @Body() updateInventorisDto: UpdateInventorisDto) {
		return this.inventorisService.update(id, updateInventorisDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete penerimaan barang jadi berstatus DRAFT' })
	remove(@Param('id') id: string) {
		return this.inventorisService.remove(id);
	}

	@Post(':id/post')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Posting penerimaan barang jadi' })
	post(@Param('id') id: string) {
		return this.inventorisService.post(id);
	}

	@Post(':id/revert')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Revert posting penerimaan barang jadi' })
	revert(@Param('id') id: string) {
		return this.inventorisService.revert(id);
	}
}
