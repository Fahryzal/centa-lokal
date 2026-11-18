import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxMasterController } from './tax.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [TaxMasterController],
	providers: [HelperGlobal, TaxService],
})
export class TaxMasterModule {}
