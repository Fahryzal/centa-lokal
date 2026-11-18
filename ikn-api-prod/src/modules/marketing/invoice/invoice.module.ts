import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [InvoiceController],
	providers: [HelperGlobal, InvoiceService],
})
export class InvoiceModule {}
