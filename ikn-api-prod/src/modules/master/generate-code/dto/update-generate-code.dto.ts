import { PartialType } from '@nestjs/swagger';
import { CreateGenerateCodeDto } from './create-generate-code.dto';

export class UpdateGenerateCodeDto extends PartialType(CreateGenerateCodeDto) {}
