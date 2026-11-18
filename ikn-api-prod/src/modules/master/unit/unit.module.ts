import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [UnitController],
	providers: [HelperGlobal, UnitService],
})
export class UnitModule {}
