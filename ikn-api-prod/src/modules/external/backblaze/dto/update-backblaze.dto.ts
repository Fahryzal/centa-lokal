import { PartialType } from '@nestjs/swagger';
import { CreateBackblazeDto } from './create-backblaze.dto';

export class UpdateBackblazeDto extends PartialType(CreateBackblazeDto) {}
