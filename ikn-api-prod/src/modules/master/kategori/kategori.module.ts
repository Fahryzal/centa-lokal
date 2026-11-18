import { Module } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { KategoriController } from './kategori.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [KategoriController],
	providers: [HelperGlobal, KategoriService],
})
export class KategoriModule {}
