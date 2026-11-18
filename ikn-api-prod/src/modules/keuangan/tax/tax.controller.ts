import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GetTaxDto } from './dto/get-tax.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@src/modules/common/get-user.decorator.ts';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('tax')
@ApiTags('tax')
export class TaxController {
	constructor(private readonly taxService: TaxService) {}

	@Post()
	@ApiBearerAuth() //+
	create(@Body() createTaxDto: CreateTaxDto) {
		return this.taxService.create(createTaxDto);
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
		return this.taxService.findOne(+id);
	}

	@Patch(':id')
	@ApiBearerAuth() //+
	update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
		return this.taxService.update(+id, updateTaxDto);
	}

	@Delete(':id')
	@ApiBearerAuth() //+
	remove(@Param('id') id: string) {
		return this.taxService.remove(+id);
	}
}
