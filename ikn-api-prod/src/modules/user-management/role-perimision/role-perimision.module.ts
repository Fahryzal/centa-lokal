import { Module } from '@nestjs/common';
import { RolePerimisionService } from './role-perimision.service';
import { RolePerimisionController } from './role-perimision.controller';

@Module({
	controllers: [RolePerimisionController],
	providers: [RolePerimisionService],
})
export class RolePerimisionModule {}
