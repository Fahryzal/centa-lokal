import { Module } from '@nestjs/common';
import { SalesPlanService } from './sales-plan.service';
import { SalesPlanController } from './sales-plan.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [SalesPlanController],
	providers: [HelperGlobal, SalesPlanService],
})
export class SalesPlanModule {}
