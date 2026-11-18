import { PartialType } from '@nestjs/swagger';
import { CreateShareModuleDto } from './create-share-module.dto';

export class UpdateShareModuleDto extends PartialType(CreateShareModuleDto) {}
