import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [SupplierController],
	providers: [HelperGlobal, SupplierService],
})
export class SupplierModule {}
