import { Body, Controller, Post } from '@nestjs/common';
import { CreateShareModuleDto } from './dto/create-share-module.dto';

@Controller('share-module')
export class ShareModuleController {
	@Post()
	create(@Body() createShareModuleDto: CreateShareModuleDto) {}
}
