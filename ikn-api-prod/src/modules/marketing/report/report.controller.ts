import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetLaporanPenjualanItemDto } from './dto/get-laporan-penjualan-pra.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('report-marekting')
@ApiTags('report marekting')
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Get('/laporan-penjualan')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET laporan penjualan' })
	salesReport(@Query() query: GetLaporanPenjualanItemDto) {
		return this.reportService.salesReport(query);
	}
}
