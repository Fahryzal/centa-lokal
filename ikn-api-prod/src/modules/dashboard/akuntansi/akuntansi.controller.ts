import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AkuntansiService } from './akuntansi.service';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankBalanceFilterDto, ExpenseFilterDto, NetProfitFilterDto } from './dto/get-akuntansi.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('dashboar-akuntansi')
@ApiTags('Dashboard - Akuntansi')
export class AkuntansiController {
	constructor(private readonly akuntansiService: AkuntansiService) {}

	@Get('income-expense')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Finance and Accountant' })
	async getIncomeExpense(@Query('year') year: string, @Query('unitId') unitId?: string) {
		return this.akuntansiService.getMonthlyIncomeExpense(Number(year), unitId);
	}

	@Get('cash-flow')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Arus Kas (Cash Flow)' })
	getCashFlow(@Query('year') year?: string, @Query('month') month?: string, @Query('unitId') unitId?: string) {
		return this.akuntansiService.getCashFlow({ year, month, unitId });
	}

	@Get('net-profit')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Laba Bersih' })
	async getNetProfit(@Query() filter: NetProfitFilterDto) {
		return this.akuntansiService.getNetProfit(filter);
	}

	@Get('bank-balance')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Saldo Bank per Akun' })
	async getBankBalance(@Query() filter: BankBalanceFilterDto) {
		return this.akuntansiService.getBankBalances(filter);
	}

	@Get('summary')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Dashboard Summary (Cash, Payable, Receivable)' })
	async getDashboardSummary(@Query('period') period?: string) {
		return this.akuntansiService.getDashboardSummary(period);
	}

	@Get('expensive')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Komposisi Biaya' })
	async getSummary() {
		return this.akuntansiService.getSummary();
	}

	@Get('expense-summary')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Komposisi Biaya v2' })
	async getExpenseSummary(@Query() q: ExpenseFilterDto) {
		return this.akuntansiService.getExpenseSummary(q);
	}
}
