import { Module } from '@nestjs/common';
import { ShareModuleService } from '@src/modules/share-module/share-module.service';
import { GenerateCodeController } from './generate-code.controller';
import { GenerateCodeService } from './generate-code.service';

@Module({
	controllers: [GenerateCodeController],
	providers: [GenerateCodeService, ShareModuleService],
})
export class GenerateCodeModule {}
