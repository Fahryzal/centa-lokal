import { Module } from '@nestjs/common';
import { BackblazeService } from './backblaze.service';
import { BackblazeController } from './backblaze.controller';

@Module({
	controllers: [BackblazeController],
	providers: [BackblazeService],
	exports: [BackblazeService], // Jika ingin digunak
})
export class BackblazeModule {}
