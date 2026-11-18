import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { HelperGlobal } from '@src/common/utils/helper/helper';

@Module({
	controllers: [ProductController],
	providers: [HelperGlobal, ProductService],
})
export class ProductModule {}
