import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PurchaseOrderTaxService } from './purchase-order-tax.service';
import { BulkCreatePurchaseOrderTaxDto } from './dto/create-purchase-order-tax.dto';
import { BulkCreatePurchaseOrderTaxRNDto } from './dto/create-purchase-order-tax-rn.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPurchaseOrderTaxDto } from './dto/get-purchase-order-tax.dto';
import { AuthGuard } from '@nestjs/passport';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('PurchaseOrderTax')
@ApiTags('PurchaseOrderTax')
export class PurchaseOrderTaxController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly purchaseOrderTaxService: PurchaseOrderTaxService
	) {}

	@Post()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create PurchaseOrderTax' })
	create(@Req() req: Request, @Body() createPurchaseOrderTaxDto: BulkCreatePurchaseOrderTaxDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.purchaseOrderTaxService.create(createPurchaseOrderTaxDto, decoded);
	}

	@Post('rn')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create PurchaseOrderTax RN' })
	createRN(@Body() createPurchaseOrderTaxDto: BulkCreatePurchaseOrderTaxRNDto) {
		return this.purchaseOrderTaxService.createRN(createPurchaseOrderTaxDto);
	}

	@Get(':purchaseOrderId')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get PurchaseOrderTax' })
	findAll(@Query() query: GetPurchaseOrderTaxDto, @Param('id') purchaseOrderId: string) {
		return this.purchaseOrderTaxService.findAll(query, purchaseOrderId);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	findOne(@Param('id') id: string) {
		return this.purchaseOrderTaxService.findOne(id);
	}
	@Patch('update-rn')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Update PurchaseOrderTax RN' })
	updateRN(@Body() updatePurchaseOrderTaxDto: BulkCreatePurchaseOrderTaxRNDto) {
		return this.purchaseOrderTaxService.updateRN(updatePurchaseOrderTaxDto);
	}

	@Patch('')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Update PurchaseOrderTax RA' })
	update(@Body() updatePurchaseOrderTaxDto: BulkCreatePurchaseOrderTaxDto) {
		return this.purchaseOrderTaxService.update(updatePurchaseOrderTaxDto);
	}
}
