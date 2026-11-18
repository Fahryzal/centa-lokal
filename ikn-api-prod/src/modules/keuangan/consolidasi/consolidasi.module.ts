import { Module } from '@nestjs/common';
import { ConsolidasiService } from './consolidasi.service';
import { ConsolidasiController } from './consolidasi.controller';

@Module({
	controllers: [ConsolidasiController],
	providers: [ConsolidasiService],
})
export class ConsolidasiModule {}
