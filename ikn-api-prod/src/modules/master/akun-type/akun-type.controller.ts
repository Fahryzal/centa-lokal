import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AkunTypeService } from './akun-type.service';
import { CreateAkunTypeDto } from './dto/create-akun-type.dto';
import { UpdateAkunTypeDto } from './dto/update-akun-type.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { GetAkunTypeDto } from './dto/get-akun-type.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('akun-type')
@ApiTags('akun-type')
export class AkunTypeController {
	constructor(private readonly akunTypeService: AkunTypeService) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create Akun Type' })
	create(@Body() createAkunTypeDto: CreateAkunTypeDto) {
		return this.akunTypeService.create(createAkunTypeDto);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get Akun Type' })
	findAll(@Query() query: GetAkunTypeDto) {
		return this.akunTypeService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	findOne(@Param('id') id: string) {
		return this.akunTypeService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	update(@Param('id') id: string, @Body() updateAkunTypeDto: UpdateAkunTypeDto) {
		return this.akunTypeService.update(id, updateAkunTypeDto);
	}

	@Delete(':id')
	@ApiBearerAuth()
	remove(@Param('id') id: string) {
		return this.akunTypeService.remove(id);
	}
}
