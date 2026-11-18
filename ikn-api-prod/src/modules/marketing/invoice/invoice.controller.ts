import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { Request } from 'express';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoiceDto } from './dto/get-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('invoice')
@ApiTags('Invoice')
export class InvoiceController {
	constructor(
		private readonly invoiceService: InvoiceService,
		private readonly helperGlobal: HelperGlobal,
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create invoice' })
	create(@Body() createInvoiceDto: CreateInvoiceDto) {
		return this.invoiceService.create(createInvoiceDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get invoice' })
	findAll(@Req() req: Request, @Query() query: GetInvoiceDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.invoiceService.findAll(query, decoded);
	}

	@Post('spb-items')
	async getSpbsForInvoice(@Body() body: { spbIds: string[] }) {
		return this.invoiceService.getSpbsForInvoice(body.spbIds);
	}

	@Get('next-ra-number')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get next RA invoice number' })
	getNextRaInvoiceNumber() {
		return this.invoiceService.getNextRaInvoiceNumber();
	}

	@Get('ra-by-purchase-order/:purchaseOrderId')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get RA invoice by purchase order' })
	getRaInvoiceByPurchaseOrder(@Param('purchaseOrderId') purchaseOrderId: string) {
		return this.invoiceService.getRaInvoiceByPurchaseOrder(purchaseOrderId);
	}

	@Get(':id')
	@ApiBearerAuth()
	findOne(@Param('id') id: string) {
		return this.invoiceService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
		return this.invoiceService.update(id, updateInvoiceDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	remove(@Param('id') id: string) {
		return this.invoiceService.remove(id);
	}

	@Delete(':id/drop')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Drop Invoice RA' })
	drop(@Param('id') id: string) {
		return this.invoiceService.drop(id);
	}
}
