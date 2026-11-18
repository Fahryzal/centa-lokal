import { Module } from '@nestjs/common';
import { BarangMentahService } from './barang-mentah.service';
import { BarangMentahController } from './barang-mentah.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [BarangMentahController],
	providers: [HelperGlobal, BarangMentahService],
})
export class BarangMentahModule {}
