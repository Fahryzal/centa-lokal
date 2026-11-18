import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class InventoryFilterDto {
	@ApiPropertyOptional({ description: 'productId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	productId?: string;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId?: string;

	@ApiPropertyOptional({ description: 'startDate' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	startDate?: string;

	@ApiPropertyOptional({ description: 'endDate' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	endDate?: string; // RA, RN, RN EKSPOR
}
