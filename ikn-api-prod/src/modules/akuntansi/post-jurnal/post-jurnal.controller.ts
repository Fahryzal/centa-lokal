import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { CreateJurnalEntryDto } from '@src/modules/keuangan/jurnal-entry/dto/create-jurnal-entry.dto';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { Request } from 'express';
import { GetPostJurnalEntryDto } from './dto/get-post-jurnal.dto';
import { PostJurnalService } from './post-jurnal.service';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt')) //+
@SetModuleName('post-jurnal')
@ApiTags('Post Jurnal')
export class PostJurnalController {
	constructor(
		private readonly helperGlobal: HelperGlobal,
		private readonly postJurnalService: PostJurnalService,
	) {}

	@Post(':id/post')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Posting Jurnal' })
	postJournal(@Req() req: Request, @Param('id') id: string) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.postJurnalService.postJournal(id, decoded);
	}

	@Post(':id/revert')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Posting Jurnal' })
	postRevertJournal(@Req() req: Request, @Body() createJurnalEntryDto: CreateJurnalEntryDto, @Param('id') id: string) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.postJurnalService.postJournalRevert(id, createJurnalEntryDto, decoded);
	}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Posting Jurnal' })
	findAll() {
		return this.postJurnalService.findAll();
	}

	@Get('/buku-besar')
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Buku Besar' })
	findBukuBesar(@Query() query: GetPostJurnalEntryDto, @Req() req: Request) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.postJurnalService.findBukuBesar(query, decoded);
	}
}
