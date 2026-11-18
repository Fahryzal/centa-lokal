import { Module } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { ShareModuleService } from '@src/modules/share-module/share-module.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
	controllers: [TransactionController],
	providers: [HelperGlobal, TransactionService, ShareModuleService],
})
export class TransactionModule {}
