import { PartialType } from '@nestjs/swagger';
import { CreateTaxMasterDto } from './create-tax.dto';

export class UpdateTaxDto extends PartialType(CreateTaxMasterDto) {}
