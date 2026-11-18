import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAccountDto } from './dto/get-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('account')
@ApiTags('Account')
export class AccountController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly accountService: AccountService
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create account' })
	@ApiBody({ type: CreateAccountDto })
	create(@Req() req: Request, @Body() createAccountDto: CreateAccountDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.accountService.create(createAccountDto, decoded);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'GET account' })
	findAll(@Query() query: GetAccountDto) {
		return this.accountService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth()
	findOne(@Param('id') id: string) {
		return this.accountService.findOne(id);
	}

	@Patch(':id')
	@ApiBearerAuth()
	update(@Req() req: Request, @Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.accountService.update(id, updateAccountDto, decoded);
	}

	@Delete(':id')
	@ApiBearerAuth()
	remove(@Param('id') id: string) {
		return this.accountService.remove(id);
	}
}
