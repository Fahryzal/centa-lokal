import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [MenusController],
	providers: [HelperGlobal, MenusService],
})
export class MenusModule {}
