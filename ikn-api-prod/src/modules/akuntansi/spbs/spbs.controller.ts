import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { SpbsService } from './spbs.service';
import { CreateSpbDto } from './dto/create-spb.dto';
import { UpdateSpbDto } from './dto/update-spb.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBody, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetSpbsDto } from './dto/get-spb.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Controller({ version: '1' })
@SetModuleName('spbs')
@UseGuards(AuthGuard('jwt')) //+
@ApiTags('spbs')
export class SpbsController {
	constructor(
		private readonly spbsService: SpbsService,
		private readonly helperGlobal: HelperGlobal
	) {}

	@Post()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create Spbs' })
	@ApiBody({ type: CreateSpbDto })
	createRa(@Body() createSpbDto: CreateSpbDto) {
		return this.spbsService.createRa(createSpbDto);
	}

	@Post('rn-ekspor')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create Spbs RN Ekspor' })
	@ApiBody({ type: CreateSpbDto })
	createRnEkspor(@Req() req: Request, @Body() createSpbDto: CreateSpbDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.spbsService.createRnEkspor(createSpbDto, decoded);
	}

	@Post('rn')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create Spbs RN' })
	@ApiBody({ type: CreateSpbDto })
	createRN(@Req() req: Request, @Body() createSpbDto: CreateSpbDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.spbsService.createRN(createSpbDto, decoded.id);
	}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Spbs' })
	findAll(@Req() req: Request, @Query() query: GetSpbsDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.spbsService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Spbs by id' })
	findOne(@Param('id') id: string) {
		return this.spbsService.findOne(id);
	}

	@Get('/stok-log/:orderNumber')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get stok log by orderNumber' })
	findMany(@Param('orderNumber') orderNumber: string) {
		return this.spbsService.findMany(orderNumber);
	}

	@Patch(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Update Spbs' })
	update(@Param('id') id: string, @Body() updateSpbDto: UpdateSpbDto) {
		return this.spbsService.update(id, updateSpbDto);
	}

	@Delete(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Delete Spbs' })
	remove(@Param('id') id: string) {
		return this.spbsService.remove(id);
	}
}
