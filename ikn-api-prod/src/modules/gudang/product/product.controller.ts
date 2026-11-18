import { Controller, Get, UseGuards, Query, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductDto } from './dto/get-product.dto';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { Request } from 'express';

@Controller({ version: '1' })
@SetModuleName('product')
@UseGuards(AuthGuard('jwt')) //+
@ApiTags('product')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly helperGlobal: HelperGlobal
	) {}

	@Get()
	@ApiBearerAuth() //+
	@ApiOperation({ summary: 'Get Product Sale' })
	findAll(@Req() req: Request, @Query() query: GetProductDto) {
		const decoded = this.helperGlobal.decodeJwt(req);
		return this.productService.findAll(query, decoded);
	}
}
