import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ReportGeneratEdgerService } from './report-generat-edger.service';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ version: '1' })
@SetModuleName('report-generat-edger')
@UseGuards(AuthGuard('jwt')) //+
@ApiTags('Report generat Edger')
export class ReportGeneratEdgerController {
	constructor(private readonly reportGeneratEdgerService: ReportGeneratEdgerService) {}

	@Get('/report')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getIncomeStatementFromLedger report general edger' })
	getIncomeStatementFromLedger(@Query('period') period: string) {
		return this.reportGeneratEdgerService.getIncomeStatementFromLedger(period);
	}

	@Get('/by-unit')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getTrialBalanceGroupedByUnit report general edger' })
	getTrialBalanceGroupedByUnit(@Query('period') period: string) {
		return this.reportGeneratEdgerService.getTrialBalanceGroupedByUnit(period);
	}

	@Get('/trial-balance')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'generateTrialBalance report general edger' })
	generateTrialBalance(@Query('unitId') unitId: string | string[], @Query('period') period: string) {
		// const fiscalYear = period.split('-')[0]; // e.g. '2025'
		return this.reportGeneratEdgerService.generateTrialBalanceV2(unitId, period);
	}

	@Get('/max-periode')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'max periode report general edger' })
	maxPeriode(@Query('unitId') unitId: string | string[]) {
		// const fiscalYear = period.split('-')[0]; // e.g. '2025'
		return this.reportGeneratEdgerService.maxPeriode(unitId);
	}

	@Get('/income-statement-general-ledger')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getIncomeStatement report general edger' })
	getIncomeStatement(@Query('unitId') unitId: string, @Query('period') period: string) {
		return this.reportGeneratEdgerService.getIncomeStatement(unitId, period);
	}

	@Get('/balance-sheet-general-ledger')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getBalanceSheet report general edger' })
	getBalanceSheet(@Query('unitId') unitId: string, @Query('period') period: string) {
		return this.reportGeneratEdgerService.getBalanceSheet(unitId, period);
	}

	@Get('/changes-equity-general-ledger')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getChangesInEquity report general edger' })
	getChangesInEquity(@Query('unitId') unitId: string, @Query('period') period: string) {
		return this.reportGeneratEdgerService.getChangesInEquity(unitId, period);
	}

	@Get('summary-general-ledger')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getFinancialSummary report general edger' })
	getFinancialSummary(@Query('unitId') unitId: string, @Query('period') period: string) {
		return this.reportGeneratEdgerService.getFinancialSummary(unitId, period);
	}

	@Get('consolidasi-general-ledger')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'getConsolidatedReport report general edger' })
	getConsolidatedReport(@Query('start') start: string, @Query('end') end: string) {
		const startDate = new Date(start);
		const endDate = new Date(end);
		return this.reportGeneratEdgerService.getConsolidatedReport(startDate, endDate);
	}
}
