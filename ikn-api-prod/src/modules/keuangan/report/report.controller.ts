import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetReportDto } from './dto/get-report.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('report-keuangan')
@ApiTags('Report keuangan')
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Get('/income-statement')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get report keuangan' })
	getIncomeStatement(@Query('start') start: string, @Query('end') end: string, @Query('unitId') unitId: string) {
		const startDate = new Date(start);
		const endDate = new Date(end);
		return this.reportService.getIncomeStatement(startDate, endDate, unitId);
	}

	@Get('/balance-sheet')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get report balance sheet' })
	getBalanceSheet(@Query() query: GetReportDto) {
		return this.reportService.getBalanceSheetParent(query);
	}

	@Get('/cash-flow')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get report cash flow' })
	async getCashFlow(
		@Query('startDate') startDateStr: string,
		@Query('endDate') endDateStr: string,
		@Query('unitId') unitId: string
	) {
		const startDate = new Date(startDateStr);
		const endDate = new Date(endDateStr);

		return this.reportService.getCashFlow(startDate, endDate, unitId);
	}
}
