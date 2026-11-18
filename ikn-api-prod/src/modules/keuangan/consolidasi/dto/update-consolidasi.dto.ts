import { PartialType } from '@nestjs/swagger';
import { CreateConsolidasiDto } from './create-consolidasi.dto';

export class UpdateConsolidasiDto extends PartialType(CreateConsolidasiDto) {}
