import { PartialType } from '@nestjs/swagger';
import { CreateSalesPlanDto } from './create-sales-plan.dto';

export class UpdateSalesPlanDto extends PartialType(CreateSalesPlanDto) {}
