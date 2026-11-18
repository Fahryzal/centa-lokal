import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { Request } from 'express';

import { CreateFinishedGoodsIssueDto } from './dto/create-finished-goods-issue.dto';
import { UpdateFinishedGoodsIssueDto } from './dto/update-finished-goods-issue.dto';
import { FinishedGoodsIssueService } from './finished-goods-issue.service';

@Controller({
	path: 'finished-goods-issue',
	version: '1',
})
@SetModuleName('Pengeluaran Barang Jadi')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Pengeluaran Barang Jadi')
export class FinishedGoodsIssueController {
	constructor(
		private readonly finishedGoodsIssueService: FinishedGoodsIssueService,
		private readonly helperGlobal: HelperGlobal,
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create pengeluaran barang jadi' })
	create(@Req() req: Request, @Body() dto: CreateFinishedGoodsIssueDto) {
		const decoded = this.helperGlobal.decodeJwt(req);

		return this.finishedGoodsIssueService.create(dto, decoded.id);
	}

	@Get()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get all pengeluaran barang jadi' })
	findAll(@Req() req: Request, @Query() query: any) {
		const decoded = this.helperGlobal.decodeJwt(req);

		return this.finishedGoodsIssueService.findAll(query, decoded);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get detail pengeluaran barang jadi berdasarkan ID' })
	findOne(@Req() req: Request, @Param('id') id: string) {
		const decoded = this.helperGlobal.decodeJwt(req);

		return this.finishedGoodsIssueService.findOne(id, decoded);
	}

	// POST pengeluaran barang jadi
	@Post(':id/post')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Posting pengeluaran barang jadi' })
	post(@Req() req: Request, @Param('id') id: string) {
		const decoded = this.helperGlobal.decodeJwt(req);

		return this.finishedGoodsIssueService.post(id, decoded);
	}

	// REVERT pengeluaran barang jadi
	@Post(':id/revert')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Revert pengeluaran barang jadi' })
	revert(@Req() req: Request, @Param('id') id: string) {
		const decoded = this.helperGlobal.decodeJwt(req);

		return this.finishedGoodsIssueService.revert(id, decoded);
	}

	// UPDATE pengeluaran barang jadi
	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update pengeluaran barang jadi' })
	update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateFinishedGoodsIssueDto) {
		const decoded = this.helperGlobal.decodeJwt(req);

		return this.finishedGoodsIssueService.update(id, dto, decoded);
	}

	// DELETE pengeluaran barang jadi
	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete pengeluaran barang jadi' })
	remove(@Req() req: Request, @Param('id') id: string) {
		const decoded = this.helperGlobal.decodeJwt(req);

		return this.finishedGoodsIssueService.remove(id, decoded);
	}
}
