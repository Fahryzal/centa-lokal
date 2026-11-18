import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [CustomersController],
	providers: [HelperGlobal, CustomersService],
})
export class CustomersModule {}
