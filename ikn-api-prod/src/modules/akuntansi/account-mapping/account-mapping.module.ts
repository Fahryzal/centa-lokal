import { Module } from '@nestjs/common';
import { AccountMappingService } from './account-mapping.service';
import { AccountMappingController } from './account-mapping.controller';

@Module({
	controllers: [AccountMappingController],
	providers: [AccountMappingService],
})
export class AccountMappingModule {}
