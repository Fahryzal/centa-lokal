import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { Request } from 'express';
import { GetBuyerDto, GetInvoiceDto, GetMareketingRaDto, GetSalesPlanDto } from './dto/get-marketing-ra.dto';
import { MareketingRaService } from './mareketing-ra.service';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('mareketing-ra')
@ApiTags('mareketing-ra')
export class MareketingRaController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly mareketingRaService: MareketingRaService,
	) {}

	@Get('/summary')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Dashboard Summary (Total PO, SPB, Invoice, Customer)' })
	getSummary(@Query('period') period?: string) {
		return this.mareketingRaService.getSummary(period);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Monhtly Status Sale Charts' })
	getPurchaseOrderStats(@Query() query: GetMareketingRaDto, @Req() req: Request) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.mareketingRaService.getPurchaseOrderStats(query, decoded);
	}

	@Get('/invoice')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Status Invoice' })
	getInvoiceDataByPeriod(@Query() query: GetInvoiceDto) {
		return this.mareketingRaService.getInvoiceDataByPeriod(query);
	}

	@Get('/sales-per-month')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Sales Per Month' })
	getPurchaseOrderStatsTop5(@Query() query: GetMareketingRaDto) {
		return this.mareketingRaService.getPurchaseOrderStatsTop5(query);
	}

	@Get('/plan-actual')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Plan Actual' })
	getPlanVsActual(@Query() query: GetSalesPlanDto) {
		return this.mareketingRaService.getPlanVsActual(query);
	}

	@Get('/buyer-record')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Buyer Record' })
	getBuyerRecord(@Query() query: GetBuyerDto) {
		return this.mareketingRaService.getBuyerRecord(query);
	}

	@Get('/product-category')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get Product Category' })
	getProductCategory() {
		return this.mareketingRaService.getProductCategory();
	}
}
