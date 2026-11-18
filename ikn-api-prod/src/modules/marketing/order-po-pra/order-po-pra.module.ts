import { Module } from '@nestjs/common';
import { OrderPoPraService } from './order-po-pra.service';
import { OrderPoPraController } from './order-po-pra.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [OrderPoPraController],
	providers: [HelperGlobal, OrderPoPraService],
})
export class OrderPoPraModule {}
