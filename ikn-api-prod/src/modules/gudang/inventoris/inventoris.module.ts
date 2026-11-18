import { Module } from '@nestjs/common';
import { InventorisService } from './inventoris.service';
import { InventorisController } from './inventoris.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [InventorisController],
	providers: [HelperGlobal, InventorisService],
})
export class InventorisModule {}
