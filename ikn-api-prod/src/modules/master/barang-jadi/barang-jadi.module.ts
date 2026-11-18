import { Module } from '@nestjs/common';
import { BarangJadiService } from './barang-jadi.service';
import { BarangJadiController } from './barang-jadi.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	imports: [],
	controllers: [BarangJadiController],
	providers: [HelperGlobal, BarangJadiService],
})
export class BarangJadiModule {}
