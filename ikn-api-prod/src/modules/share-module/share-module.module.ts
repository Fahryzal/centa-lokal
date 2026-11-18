import { Module } from '@nestjs/common';
import { ShareModuleController } from './share-module.controller';

@Module({
	controllers: [ShareModuleController],
	providers: [],
})
export class ShareModuleModule {}
