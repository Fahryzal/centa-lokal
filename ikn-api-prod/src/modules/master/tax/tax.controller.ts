import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxMasterDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTaxDto } from './dto/get-tax.dto';
import { AuthGuard } from '@nestjs/passport';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('tax master')
@ApiTags('Tax Master')
export class TaxMasterController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly taxService: TaxService
	) {}

	@Post()
	@ApiBearerAuth() //+
	create(@Req() req: Request, @Body() createTaxDto: CreateTaxMasterDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.taxService.create(createTaxDto, decoded);
	}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get tax' })
	findAll(@Query() query: GetTaxDto) {
		return this.taxService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	findOne(@Param('id') id: string) {
		return this.taxService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth() //+
	update(@Req() req: Request, @Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.taxService.update(id, updateTaxDto, decoded);
	}

	@Delete(':id')
	@ApiBearerAuth() //+
	remove(@Param('id') id: string) {
		return this.taxService.remove(id);
	}
}
