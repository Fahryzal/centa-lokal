import { Module } from '@nestjs/common';
import { SatuanService } from './satuan.service';
import { SatuanController } from './satuan.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [SatuanController],
	providers: [HelperGlobal, SatuanService],
})
export class SatuanModule {}
