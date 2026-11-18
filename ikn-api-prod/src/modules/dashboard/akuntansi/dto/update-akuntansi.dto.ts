import { PartialType } from '@nestjs/swagger';
import { CreateAkuntansiDto } from './create-akuntansi.dto';

export class UpdateAkuntansiDto extends PartialType(CreateAkuntansiDto) {}
