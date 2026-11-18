import { Module } from '@nestjs/common';
import { AuthChallengeService } from './auth-challenge.service';
import { AuthChallengeController } from './auth-challenge.controller';

@Module({
	controllers: [AuthChallengeController],
	providers: [AuthChallengeService],
})
export class AuthChallengeModule {}
