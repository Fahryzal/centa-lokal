import { Module } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { MareketingRaController } from './mareketing-ra.controller';
import { MareketingRaService } from './mareketing-ra.service';

@Module({
	controllers: [MareketingRaController],
	providers: [HelperGlobal, MareketingRaService],
})
export class MareketingRaModule {}
