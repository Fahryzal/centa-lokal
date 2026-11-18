import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { Request } from 'express';
import { CreateOrderDeleveryPraDto } from './dto/create-order-delevery-pra.dto';
import { GetDeliveryOrderPRADto } from './dto/get-order-delevery-pra.dto';
import { UpdateOrderDeleveryPraDto } from './dto/update-order-delevery-pra.dto';
import { OrderDeleveryPraService } from './order-delevery-pra.service';
@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('order-delevery-pra')
@ApiTags('order-delevery-pra')
export class OrderDeleveryPraController {
	constructor(
		private readonly orderDeleveryPraService: OrderDeleveryPraService,
		private readonly helperGlobal: HelperGlobal,
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create Delevery Order PRA' })
	create(@Req() req: Request, @Body() createOrderDeleveryPraDto: CreateOrderDeleveryPraDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.orderDeleveryPraService.create(createOrderDeleveryPraDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET Delivery Order PRA' })
	findAll(@Req() req: Request, @Query() query: GetDeliveryOrderPRADto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.orderDeleveryPraService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET Delivery Order PRA by id' })
	findOne(@Param('id') id: string) {
		return this.orderDeleveryPraService.findOne(id);
	}

	@Get('history/:purchaseOrderId')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET History Delivery Order PRA by Purchase Order' })
	findHistoryByPurchaseOrder(@Param('purchaseOrderId') purchaseOrderId: string) {
		return this.orderDeleveryPraService.findHistoryByPurchaseOrder(purchaseOrderId);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Patch Delevery Order PRA by id' })
	update(@Param('id') id: string, @Body() updateOrderDeleveryPraDto: UpdateOrderDeleveryPraDto) {
		return this.orderDeleveryPraService.update(id, updateOrderDeleveryPraDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'SOFT DELETE Delivery order by id' })
	remove(@Param('id') id: string) {
		return this.orderDeleveryPraService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Restore DELETE Delivery' })
	restore(@Param('id') id: string) {
		return this.orderDeleveryPraService.restore(id);
	}
}
