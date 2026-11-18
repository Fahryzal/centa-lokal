import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';

class CreateRolePermisionDto {
	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'menuId tidak boleh kosong' })
	@ApiProperty({ description: 'menuId, menu mana yang akan di assign', type: Number })
	menuId: number;

	@Validators.IsBoolean()
	@Validators.IsOptional()
	@ApiProperty({ description: 'canView', type: Boolean })
	canView?: boolean;

	@Validators.IsBoolean()
	@Validators.IsOptional()
	@ApiProperty({ description: 'canAdd', type: Boolean })
	canAdd?: boolean;

	@Validators.IsBoolean()
	@Validators.IsOptional()
	@ApiProperty({ description: 'canEdit', type: Boolean })
	canEdit?: boolean;

	@Validators.IsBoolean()
	@Validators.IsOptional()
	@ApiProperty({ description: 'canDelete', type: Boolean })
	canDelete?: boolean;

	@Validators.IsBoolean()
	@Validators.IsOptional()
	@ApiProperty({ description: 'canApprove', type: Boolean })
	canApprove?: boolean;
}

export class CreateRoleDto {
	@Validators.IsString({ message: 'name harus string' })
	@Validators.IsNotEmpty({ message: 'name tidak boleh kosong' })
	@ApiProperty({ description: 'name', type: String })
	name: string;

	@Validators.ValidateNested()
	@Transformers.Type(() => CreateRolePermisionDto)
	@ApiProperty({ type: [CreateRolePermisionDto] })
	rolePermission: CreateRolePermisionDto[];
}
