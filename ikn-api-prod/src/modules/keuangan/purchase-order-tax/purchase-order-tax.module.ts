import { Module } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { ShareModuleService } from '@src/modules/share-module/share-module.service';
import { PurchaseOrderTaxController } from './purchase-order-tax.controller';
import { PurchaseOrderTaxService } from './purchase-order-tax.service';

@Module({
	controllers: [PurchaseOrderTaxController],
	providers: [HelperGlobal, PurchaseOrderTaxService, ShareModuleService],
})
export class PurchaseOrderTaxModule {}
