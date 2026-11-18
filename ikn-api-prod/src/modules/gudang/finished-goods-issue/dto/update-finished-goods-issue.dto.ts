import { OmitType, PartialType } from '@nestjs/swagger';
import * as Transformers from 'class-transformer';
import * as Validators from 'class-validator';

import { CreateFinishedGoodsIssueDto, UpdateFinishedGoodsIssueDtoItemDto } from './create-finished-goods-issue.dto';

export class UpdateFinishedGoodsIssueDto extends PartialType(OmitType(CreateFinishedGoodsIssueDto, ['items'] as const)) {
	@Validators.IsOptional()
	@Validators.IsArray({ message: 'items harus berupa array' })
	@Validators.ArrayMinSize(1, {
		message: 'Pengeluaran harus memiliki minimal 1 item',
	})
	@Validators.ValidateNested({ each: true })
	@Transformers.Type(() => UpdateFinishedGoodsIssueDtoItemDto)
	items?: UpdateFinishedGoodsIssueDtoItemDto[];
}
