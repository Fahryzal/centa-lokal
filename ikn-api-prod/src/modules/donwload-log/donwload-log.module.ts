import { Module } from '@nestjs/common';
import { LogsController } from '@modules/donwload-log/donwload-log.controller';

@Module({
	controllers: [LogsController],
	providers: [],
})
export class DonwloadLogModule {}
