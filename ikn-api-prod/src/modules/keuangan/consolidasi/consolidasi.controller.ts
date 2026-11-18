import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ConsolidasiService } from './consolidasi.service';
import { CreateConsolidasiDto } from './dto/create-consolidasi.dto';
import { UpdateConsolidasiDto } from './dto/update-consolidasi.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ version: '1' })
@SetModuleName('consolidasi')
@UseGuards(AuthGuard('jwt')) //+
@ApiTags('Report Consolidasi')
export class ConsolidasiController {
	constructor(private readonly consolidasiService: ConsolidasiService) {}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getConsolidatedReport report consolidasi' })
	getConsolidatedReport(@Query('period') period: string) {
		return this.consolidasiService.getConsolidatedReport(period);
	}

	@Get('/v2')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getConsolidatedReportV2 report consolidasi' })
	getConsolidatedReportV2(@Query('period') period: string) {
		return this.consolidasiService.getConsolidatedReportV2(period);
	}
}
