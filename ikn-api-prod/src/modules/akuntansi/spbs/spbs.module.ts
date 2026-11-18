import { Module } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { ShareModuleService } from '@src/modules/share-module/share-module.service';
import { SpbsController } from './spbs.controller';
import { SpbsService } from './spbs.service';

@Module({
	controllers: [SpbsController],
	providers: [HelperGlobal, SpbsService, ShareModuleService],
})
export class SpbsModule {}
