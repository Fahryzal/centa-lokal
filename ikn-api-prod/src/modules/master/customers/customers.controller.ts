import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { GetCustomerDto } from './dto/get-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('customer')
@ApiTags('Customer')
export class CustomersController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly customersService: CustomersService
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create customer' })
	@ApiBody({ type: CreateCustomerDto })
	create(@Req() req: Request, @Body() createCustomerDto: CreateCustomerDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.customersService.create(createCustomerDto, decoded);
	}

	@Get()
	@ApiOperation({ summary: 'GET customers' })
	@ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Current page' })
	@ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
	@ApiQuery({ name: 'code', required: false, type: String, example: '', description: 'Kode customer keyword' })
	@ApiQuery({ name: 'address', required: false, type: String, example: '', description: 'Alamat search' })
	@ApiQuery({ name: 'unit', required: false, type: String, example: '', description: 'unit search' })
	@ApiQuery({ name: 'email', required: false, type: String, example: '', description: 'email search' })
	@ApiQuery({ name: 'phone', required: false, type: String, example: '', description: 'phone search' })
	@ApiQuery({ name: 'country', required: false, type: Number, example: '', description: 'country search' })
	@ApiQuery({ name: 'continent', required: false, type: String, example: '', description: 'Benua search' })
	@ApiQuery({ name: 'regional_type', required: false, type: String, example: '', description: 'Regional search' })
	findAll(@Query() query: GetCustomerDto) {
		return this.customersService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET customer by id' })
	findOne(@Param('id') id: string) {
		return this.customersService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
		return this.customersService.update(id, updateCustomerDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'SOFT DELETE customer by id' })
	remove(@Param('id') id: string) {
		return this.customersService.remove(id);
	}

	@Patch(':id/restore')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Restore customer' })
	restore(@Param('id') id: string) {
		return this.customersService.restore(id);
	}
}
