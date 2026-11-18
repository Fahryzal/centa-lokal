import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { OrderPoPraService } from './order-po-pra.service';
import { CreateOrderPoPraDto } from './dto/create-order-po-pra.dto';
import { UpdateOrderPoPraDto } from './dto/update-order-po-pra.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOrderPoPRADto } from './dto/get-order-po-pra.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { UpdateFIleBLOrderPoPraDto } from './dto/update-bl-order-po-pra.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('order-po-pra')
@ApiTags('order-po-pra')
export class OrderPoPraController {
	constructor(
		private readonly orderPoPraService: OrderPoPraService,
		private readonly helperGlobal: HelperGlobal
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create PO' })
	@ApiBody({ type: CreateOrderPoPraDto })
	create(@Req() req: Request, @Body() createOrderPoPraDto: CreateOrderPoPraDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.orderPoPraService.create(createOrderPoPraDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET PO PRA' })
	findAll(@Req() req: Request, @Query() query: GetOrderPoPRADto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.orderPoPraService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET PO PRA by id' })
	findOne(@Param('id') id: string) {
		return this.orderPoPraService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Patch PO PRA by id' })
	update(@Req() req: Request, @Param('id') id: string, @Body() updateOrderPoPraDto: UpdateOrderPoPraDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.orderPoPraService.update(id, updateOrderPoPraDto, decoded);
	}

	@Patch('file-bl/:id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Upload PO BL PRN by id' })
	updateFileBL(@Param('id') id: string, @Body() updateOrderPoPraDto: UpdateFIleBLOrderPoPraDto) {
		return this.orderPoPraService.updateFileBL(id, updateOrderPoPraDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'SOFT DELETE Po by id' })
	remove(@Param('id') id: string) {
		return this.orderPoPraService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Restore Po' })
	restore(@Param('id') id: string) {
		return this.orderPoPraService.restore(id);
	}
}
