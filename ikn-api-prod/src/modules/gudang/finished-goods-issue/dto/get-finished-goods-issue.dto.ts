
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetFinishedGoodsIssueDto {
  @ApiPropertyOptional({
    description: 'Current page',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Limit page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort by',
    example: 'createdAt',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  sortOrder?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan kode dokumen',
    example: 'PGB-001',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  documentCode?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan nomor dokumen',
    example: '001/PGB/X/2026',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan tanggal pengeluaran',
    example: '2026-10-30',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan nama unit',
    example: 'Medan',
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan status dokumen',
    example: 'DRAFT',
    enum: ['DRAFT', 'POSTED', 'REVERTED'],
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  status?: string;
}
