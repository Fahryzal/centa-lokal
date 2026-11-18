import { PartialType } from '@nestjs/swagger';
import { CreateAuthChallengeDto } from './create-auth-challenge.dto';

export class UpdateAuthChallengeDto extends PartialType(CreateAuthChallengeDto) {}
