import { PartialType } from '@nestjs/swagger';
import { CreateAkunTypeDto } from './create-akun-type.dto';

export class UpdateAkunTypeDto extends PartialType(CreateAkunTypeDto) {}
