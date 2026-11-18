import { PartialType } from '@nestjs/swagger';
import { CreateInventorisDto } from './create-inventoris.dto';

export class UpdateInventorisDto extends PartialType(CreateInventorisDto) {}
