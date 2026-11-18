import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AccountMappingService } from './account-mapping.service';
import { CreateAccountMappingDto } from './dto/create-account-mapping.dto';
import { UpdateAccountMappingDto } from './dto/update-account-mapping.dto';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAccountMappingDto } from './dto/get-account-mapping.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('account-mapping')
@ApiTags('Account Mapping')
export class AccountMappingController {
	constructor(private readonly accountMappingService: AccountMappingService) {}

	@Post()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Create Mapping' })
	@ApiBody({ type: CreateAccountMappingDto })
	create(@Body() createAccountMappingDto: CreateAccountMappingDto) {
		return this.accountMappingService.create(createAccountMappingDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get Mapping' })
	@ApiBearerAuth() //+
	findAll(@Query() query: GetAccountMappingDto) {
		return this.accountMappingService.findAll(query);
	}

	@Get(':id')
	@ApiBearerAuth() //+
	findOne(@Param('id') id: string) {
		return this.accountMappingService.findOne(+id);
	}

	@Patch(':id')
	@ApiBearerAuth() //+
	update(@Param('id') id: string, @Body() updateAccountMappingDto: UpdateAccountMappingDto) {
		return this.accountMappingService.update(id, updateAccountMappingDto);
	}

	@Delete(':id')
	@ApiBearerAuth() //+
	remove(@Param('id') id: string) {
		return this.accountMappingService.remove(id);
	}
}
