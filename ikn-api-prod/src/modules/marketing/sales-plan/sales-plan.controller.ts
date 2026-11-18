import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { SalesPlanService } from './sales-plan.service';
import { CreateSalesPlanDto } from './dto/create-sales-plan.dto';
import { UpdateSalesPlanDto } from './dto/update-sales-plan.dto';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GetSalesPlanDto } from './dto/get-sales-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('sales-plan')
@ApiTags('Sales Plan')
export class SalesPlanController {
	constructor(
		private readonly salesPlanService: SalesPlanService,
		private readonly helperGlobal: HelperGlobal
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create Sales Plan' })
	@ApiBody({ type: CreateSalesPlanDto })
	create(@Req() req: Request, @Body() createSalesPlanDto: CreateSalesPlanDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.salesPlanService.create(createSalesPlanDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET ALL Sales Plan' })
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Current page' })
	@ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
	@ApiQuery({ name: 'date', required: false, type: String, example: '', description: 'date keyword' })
	@ApiQuery({ name: 'description', required: false, type: String, example: '', description: 'description search' })
	@ApiQuery({ name: 'value rkap', required: false, type: String, example: '', description: 'nilai rkap search' })
	@ApiQuery({ name: 'status', required: false, type: String, example: 'PENDING', description: 'status search' })
	@ApiQuery({ name: 'periode_month', required: false, type: String, example: '', description: 'periode bulan search' })
	@ApiQuery({ name: 'unit', required: false, type: Number, example: '', description: 'unit search' })
	findAll(@Req() req: Request, @Query() query: GetSalesPlanDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.salesPlanService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET By Id Sales Plan' })
	findOne(@Param('id') id: string) {
		return this.salesPlanService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update Sales Plan' })
	update(@Param('id') id: string, @Body() updateSalesPlanDto: UpdateSalesPlanDto) {
		return this.salesPlanService.update(id, updateSalesPlanDto);
	}

	@Patch(':id/status')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Updtate status sales plan' })
	updateStatus(@Param('id') id: string, @Body() updateSalesPlanDto: UpdateSalesPlanDto) {
		return this.salesPlanService.updateStatus(id, updateSalesPlanDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'SOFT DELETE sales plan by id' })
	remove(@Param('id') id: string) {
		return this.salesPlanService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Restore sales plan' })
	restore(@Param('id') id: string) {
		return this.salesPlanService.restore(id);
	}
}
