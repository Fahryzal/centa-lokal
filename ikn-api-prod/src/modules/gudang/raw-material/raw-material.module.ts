import { Module } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { ShareModuleService } from '@src/modules/share-module/share-module.service';
import { RawMaterialController } from './raw-material.controller';
import { RawMaterialService } from './raw-material.service';

@Module({
	controllers: [RawMaterialController],
	providers: [HelperGlobal, RawMaterialService, ShareModuleService],
})
export class RawMaterialModule {}
