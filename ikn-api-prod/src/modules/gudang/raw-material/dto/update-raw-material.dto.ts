
import { OmitType, PartialType } from '@nestjs/swagger';
import {
  CreateRawMaterialIssueDto,
  CreateRawMaterialItemsDto,
} from './create-raw-material-issue.dto';
import { CreateRawMaterialDto } from './create-raw-material.dto';
import { Type } from 'class-transformer';
import * as Validators from 'class-validator';

// DTO update master raw material
export class UpdateRawMaterialDto extends PartialType(
  CreateRawMaterialDto
) {}

// DTO item untuk update pengeluaran bahan mentah
export class UpdateRawMaterialIssueItemDto extends CreateRawMaterialItemsDto {
  @Validators.IsOptional()
  @Validators.IsString()
  id?: string;
}

// DTO update pengeluaran bahan mentah
export class UpdateRawMaterialIssueDto extends PartialType(
  OmitType(CreateRawMaterialIssueDto, ['items'] as const)
) {
  @Validators.IsOptional()
  @Validators.IsArray({ message: 'items harus berupa array' })
  @Validators.ArrayNotEmpty({
    message: 'Item pengeluaran wajib diisi',
  })
  @Validators.ValidateNested({ each: true })
  @Type(() => UpdateRawMaterialIssueItemDto)
  items?: UpdateRawMaterialIssueItemDto[];
}
