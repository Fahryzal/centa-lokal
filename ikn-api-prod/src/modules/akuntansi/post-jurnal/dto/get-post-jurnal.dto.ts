import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import * as Transformers from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TypePenjualan } from '@prisma/client';

export class GetPostJurnalEntryDto {
	@ApiPropertyOptional({ description: 'startDate', example: '2025-05-04T15:07:30.241Z' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	startDate: string;

	@ApiPropertyOptional({ description: 'endDate', example: '2025-05-04T15:07:30.241Z' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	endDate: string;

	@ApiPropertyOptional({ description: 'accountCode' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	accountCode: string;

	@ApiPropertyOptional({ description: 'unitId' })
	@IsOptional()
	@Type(() => String)
	@IsString()
	unitId: string;
}
