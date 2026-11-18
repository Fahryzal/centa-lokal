import { PartialType } from '@nestjs/swagger';
import { CreateMareketingRaDto } from './create-mareketing-ra.dto';

export class UpdateMareketingRaDto extends PartialType(CreateMareketingRaDto) {}
