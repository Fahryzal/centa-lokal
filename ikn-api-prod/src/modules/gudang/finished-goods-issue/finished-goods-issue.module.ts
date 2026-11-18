import { Module } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { FinishedGoodsIssueController } from './finished-goods-issue.controller';
import { FinishedGoodsIssueService } from './finished-goods-issue.service';

@Module({
	controllers: [FinishedGoodsIssueController],
	providers: [HelperGlobal, FinishedGoodsIssueService],
})
export class FinishedGoodsIssueModule {}
