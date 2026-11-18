import { Module } from '@nestjs/common';
import { OpeningBalanceService } from './opening-balance.service';
import { OpeningBalanceController } from './opening-balance.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [OpeningBalanceController],
	providers: [HelperGlobal, OpeningBalanceService],
})
export class OpeningBalanceModule {}
