import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { Request } from 'express';
import { CreateOpeningBalanceDto } from './dto/create-opening-balance.dto';
import { GetOpeningBalanceDto } from './dto/get-opening-balance.dto';
import { UpdateOpeningBalanceDto } from './dto/update-opening-balance.dto';
import { OpeningBalanceService } from './opening-balance.service';

@Controller({ version: '1' })
@SetModuleName('opening-balance')
@UseGuards(AuthGuard('jwt')) //+
@ApiTags('opening-balance')
export class OpeningBalanceController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly openingBalanceService: OpeningBalanceService,
	) {}

	@Post()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create Opening Balance' })
	@ApiBody({ type: CreateOpeningBalanceDto, isArray: false })
	create(@Req() req: Request, @Body() createOpeningBalanceDto: CreateOpeningBalanceDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.openingBalanceService.create(createOpeningBalanceDto, decoded);
	}

	@Post('/posting/:jurnalID')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create Opening Balance' })
	createPostOpeningBalance(@Req() req: Request, @Param('jurnalID') jurnalID: string) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.openingBalanceService.createPostOpeningBalance(jurnalID, decoded);
	}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Opening Balance' })
	findAll(@Req() req: Request, @Query() query: GetOpeningBalanceDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.openingBalanceService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get by id Opening Balance' })
	findOne(@Param('id') id: string) {
		return this.openingBalanceService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'PUT Opening Balance' })
	update(@Req() req: Request, @Param('id') id: string, @Body() updateOpeningBalanceDto: UpdateOpeningBalanceDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.openingBalanceService.update(id, updateOpeningBalanceDto, decoded);
	}

	@Patch('revert/:id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Revert Opening Balance' })
	postOpeningBalanceRevert(
		@Req() req: Request,
		@Param('id') id: string,
		@Body() updateOpeningBalanceDto: UpdateOpeningBalanceDto,
	) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.openingBalanceService.postOpeningBalanceRevert(id, updateOpeningBalanceDto, decoded);
	}

	@Patch('open-revert/:id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Revert Opening Balance' })
	openRevert(@Param('id') id: string) {
		return this.openingBalanceService.openRevert(id);
	}

	@Delete(':id')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'DELETE Opening Balance' })
	remove(@Param('id') id: string) {
		return this.openingBalanceService.remove(id);
	}
}
