import { Module } from '@nestjs/common';
import { InvoiceEksporService } from './invoice-ekspor.service';
import { InvoiceEksporController } from './invoice-ekspor.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [InvoiceEksporController],
	providers: [HelperGlobal, InvoiceEksporService],
})
export class InvoiceEksporModule {}
