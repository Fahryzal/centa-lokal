import { PartialType } from '@nestjs/swagger';
import { CreateDonwloadLogDto } from './create-donwload-log.dto';

export class UpdateDonwloadLogDto extends PartialType(CreateDonwloadLogDto) {}
