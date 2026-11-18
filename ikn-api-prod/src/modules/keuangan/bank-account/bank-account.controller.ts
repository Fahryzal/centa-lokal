import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetBankAccountDto } from './dto/get-bank-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetBankNumberDto } from './dto/get-bank-number-account.dto';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('Bank-Account')
@ApiTags('Bank Account')
export class BankAccountController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly bankAccountService: BankAccountService
	) {}

	@Post()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create bank account' })
	@ApiBody({ type: CreateBankAccountDto })
	create(@Req() req: Request, @Body() createBankAccountDto: CreateBankAccountDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.bankAccountService.create(createBankAccountDto, decoded);
	}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Bank Account' })
	findAll(@Query() query: GetBankAccountDto) {
		return this.bankAccountService.findAll(query);
	}

	@Get('/number')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get No Number' })
	generateTransactionNumber(@Query() query: GetBankNumberDto) {
		return this.bankAccountService.generateTransactionNumber(query.bankAccountId, query.tanggal);
	}

	@Get('/number-pembayaran')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get No Number Pembayaran' })
	generateTransactionNumberPembayaran(@Query() query: GetBankNumberDto) {
		return this.bankAccountService.generateTransactionNumberPembayaran(query.tanggal);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	findOne(@Param('id') id: string) {
		return this.bankAccountService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth() //+
	update(@Req() req: Request, @Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.bankAccountService.update(id, updateBankAccountDto, decoded);
	}

	@Delete(':id')
	@ApiBearerAuth() //+
	remove(@Param('id') id: string) {
		return this.bankAccountService.remove(id);
	}

	@Patch('/revert/:id')
	@ApiBearerAuth() //+
	postOpeningBalanceRevert(@Param('id') id: string) {
		return this.bankAccountService.postOpeningBalanceRevert(id);
	}

	@Patch('/posting/:id')
	@ApiBearerAuth() //+
	postOpeningBalance(@Req() req: Request, @Param('id') id: string) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.bankAccountService.postOpeningBalance(id, decoded);
	}
}
