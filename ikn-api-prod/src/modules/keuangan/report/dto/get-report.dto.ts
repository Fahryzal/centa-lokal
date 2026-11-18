import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class GetReportDto {
	@ApiPropertyOptional({ description: 'startDate', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	startDate?: string;

	@ApiPropertyOptional({ description: 'endDate', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	endDate?: string;

	@ApiPropertyOptional({ description: 'unitId', example: '' })
	@Type(() => String)
	@IsOptional()
	@IsString()
	unitId?: string;
}
