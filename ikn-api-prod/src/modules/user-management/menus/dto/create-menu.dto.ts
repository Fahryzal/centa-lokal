import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreateMenuDto {
	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String })
	name: string;

	@Validators.IsString({ message: 'path harus string' })
	@Validators.IsNotEmpty({ message: 'path tidak boleh kosong' })
	@ApiProperty({ description: 'path', type: String })
	path: string;

	@Validators.IsString({ message: 'icon harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'icon', type: String })
	icon?: string;

	@Validators.IsNumber()
	@Validators.IsOptional()
	@ApiProperty({ description: 'parentId', type: Number })
	parentId?: number;

	@Validators.IsString({ message: 'nameParent harus string' })
	@Validators.IsOptional()
	@ApiProperty({ description: 'nameParent', type: String })
	nameParent?: string;
}
