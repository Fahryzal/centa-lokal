import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { AuthGuard } from '@nestjs/passport';
import { SetModuleName } from '@src/shared/guards/module-name.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InventoryFilterDto } from './dto/get-warehouse.dto';

@Controller({ version: '1' })
@UseGuards(AuthGuard('jwt'))
@SetModuleName('dashboard-warehouse')
@ApiTags('Dashboard - Warehouse')
export class WarehouseController {
	constructor(private readonly warehouseService: WarehouseService) {}

	@Get('summary')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Dashboard Summary (SKU, Stock In/Out, DO Status)' })
	getSummary(@Query('period') period?: string) {
		return this.warehouseService.getSummary(period);
	}

	@Get('inventory')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Grafik Barang Masuk & Keluar Barang Jadi' })
	getInventoryRawData(@Query() InventoryFilterDto: InventoryFilterDto) {
		return this.warehouseService.getInventoryRawData(InventoryFilterDto);
	}

	@Get('inventory-raw-material')
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Grafik Barang Masuk & Keluar Barang Mentah' })
	getRawMaterialTransactions(@Query() InventoryFilterDto: InventoryFilterDto) {
		return this.warehouseService.getRawMaterialTransactions(InventoryFilterDto);
	}
}
