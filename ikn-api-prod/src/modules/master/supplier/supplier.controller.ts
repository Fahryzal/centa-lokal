import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetSupplierDto } from './dto/get-supplier.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('supplier')
@ApiTags('Supplier')
export class SupplierController {
	constructor(private readonly supplierService: SupplierService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create supplier' })
	create(@Body() createSupplierDto: CreateSupplierDto) {
		return this.supplierService.create(createSupplierDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get supplier' })
	findAll(@Query() query: GetSupplierDto) {
		return this.supplierService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get supplier by id' })
	findOne(@Param('id') id: string) {
		return this.supplierService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update supplier' })
	update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
		return this.supplierService.update(id, updateSupplierDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete supplier' })
	remove(@Param('id') id: string) {
		return this.supplierService.remove(id);
	}
}
