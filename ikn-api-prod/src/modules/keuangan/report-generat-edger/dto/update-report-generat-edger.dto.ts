import { PartialType } from '@nestjs/swagger';
import { CreateReportGeneratEdgerDto } from './create-report-generat-edger.dto';

export class UpdateReportGeneratEdgerDto extends PartialType(CreateReportGeneratEdgerDto) {}
