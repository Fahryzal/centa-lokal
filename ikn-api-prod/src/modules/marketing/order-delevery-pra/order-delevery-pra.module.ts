import { Module } from '@nestjs/common';
import { OrderDeleveryPraService } from './order-delevery-pra.service';
import { OrderDeleveryPraController } from './order-delevery-pra.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [OrderDeleveryPraController],
	providers: [HelperGlobal, OrderDeleveryPraService],
})
export class OrderDeleveryPraModule {}
