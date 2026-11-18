import { Module } from '@nestjs/common';
import { AkunTypeService } from './akun-type.service';
import { AkunTypeController } from './akun-type.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [AkunTypeController],
	providers: [HelperGlobal, AkunTypeService],
})
export class AkunTypeModule {}
