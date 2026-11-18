import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthChallengeService } from './auth-challenge.service';
import { CreateAuthChallengeDto } from './dto/create-auth-challenge.dto';
import { UpdateAuthChallengeDto } from './dto/update-auth-challenge.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetModuleName } from '@src/shared/guards/module-name.guard';

@Controller({ version: '1' })
@SetModuleName('chalenge')
@ApiTags('Challange')
export class AuthChallengeController {
	constructor(private readonly authChallengeService: AuthChallengeService) {}

	@Get()
	@ApiOperation({ summary: 'Get Challange' })
	getChallenge() {
		return this.authChallengeService.generateChallenge();
	}
}
