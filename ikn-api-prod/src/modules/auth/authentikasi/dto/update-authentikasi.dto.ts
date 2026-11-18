import { PartialType } from '@nestjs/swagger';
import { CreateAuthentikasiDto } from './create-authentikasi.dto';

export class UpdateAuthentikasiDto extends PartialType(CreateAuthentikasiDto) {}
