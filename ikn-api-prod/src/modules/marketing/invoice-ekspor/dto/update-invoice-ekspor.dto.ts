import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceEksporDto } from './create-invoice-ekspor.dto';

export class UpdateInvoiceEksporDto extends PartialType(CreateInvoiceEksporDto) {}
