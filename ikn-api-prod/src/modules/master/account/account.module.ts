import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';
@Module({
	controllers: [AccountController],
	providers: [HelperGlobal, AccountService],
})
export class AccountModule {}
