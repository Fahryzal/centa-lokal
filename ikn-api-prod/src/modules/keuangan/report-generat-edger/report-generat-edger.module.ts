import { Module } from '@nestjs/common';
import { ReportGeneratEdgerService } from './report-generat-edger.service';
import { ReportGeneratEdgerController } from './report-generat-edger.controller';

@Module({
	controllers: [ReportGeneratEdgerController],
	providers: [ReportGeneratEdgerService],
})
export class ReportGeneratEdgerModule {}
