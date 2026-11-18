import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { InvoiceEksporService } from './invoice-ekspor.service';
import { CreateInvoiceEksporDto } from './dto/create-invoice-ekspor.dto';
import { UpdateInvoiceEksporDto } from './dto/update-invoice-ekspor.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { query, Request } from 'express';
import { GetInvoiceEksporDto } from './dto/get-invoice-ekspor.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('invoice-ekspor')
@ApiTags('invoice ekspor')
export class InvoiceEksporController {
	constructor(
		private readonly invoiceEksporService: InvoiceEksporService,
		private readonly helperGlobal: HelperGlobal
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create Invoice Ekspor' })
	@ApiBody({ type: CreateInvoiceEksporDto })
	create(@Req() req: Request, @Body() createInvoiceEksporDto: CreateInvoiceEksporDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.invoiceEksporService.create(createInvoiceEksporDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get Invoice Ekspor' })
	findAll(@Query() query: GetInvoiceEksporDto) {
		return this.invoiceEksporService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get By ID Invoice Ekspor' })
	findOne(@Param('id') id: string) {
		return this.invoiceEksporService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update Invoice Ekspor' })
	update(@Req() req: Request, @Param('id') id: string, @Body() updateInvoiceEksporDto: UpdateInvoiceEksporDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.invoiceEksporService.update(id, updateInvoiceEksporDto, decoded);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete Invoice Ekspor' })
	remove(@Param('id') id: string) {
		return this.invoiceEksporService.remove(id);
	}
}
