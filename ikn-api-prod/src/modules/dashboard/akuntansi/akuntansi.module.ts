import { Module } from '@nestjs/common';
import { AkuntansiService } from './akuntansi.service';
import { AkuntansiController } from './akuntansi.controller';

@Module({
	controllers: [AkuntansiController],
	providers: [AkuntansiService],
})
export class AkuntansiModule {}
