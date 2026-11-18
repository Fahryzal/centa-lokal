import { PartialType } from '@nestjs/swagger';
import { CreateRolePerimisionDto } from './create-role-perimision.dto';

export class UpdateRolePerimisionDto extends PartialType(CreateRolePerimisionDto) {}
