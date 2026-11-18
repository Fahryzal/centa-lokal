import { PartialType } from '@nestjs/swagger';
import { CreatePostJurnalDto } from './create-post-jurnal.dto';

export class UpdatePostJurnalDto extends PartialType(CreatePostJurnalDto) {}
