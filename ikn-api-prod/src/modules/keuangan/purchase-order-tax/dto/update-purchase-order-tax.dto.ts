import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseOrderTaxDto } from './create-purchase-order-tax.dto';

export class UpdatePurchaseOrderTaxDto extends PartialType(CreatePurchaseOrderTaxDto) {}
