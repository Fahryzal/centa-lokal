import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [BankAccountController],
	providers: [HelperGlobal, BankAccountService],
})
export class BankAccountModule {}
