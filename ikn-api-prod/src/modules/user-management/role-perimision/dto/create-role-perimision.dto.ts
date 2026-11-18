import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';

export class CreateRolePerimisionDto {
	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'roleId tidak boleh kosong' })
	@ApiProperty({ description: 'masuk ke roleId mana, contohnya role admin', type: Number, example: 1 })
	roleId: number;

	// @Validators.IsNumber()
	// @Validators.IsNotEmpty({ message: 'permissionId tidak boleh kosong' })
	// @ApiProperty({ description: 'permissionId', type: Number, example: 2 })
	// permissionId: number;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'menuId tidak boleh kosong' })
	@ApiProperty({ description: 'menuId, menu mana yang akan di assign', type: Number })
	menuId: number;

	@Validators.IsBoolean()
	@Validators.IsNotEmpty({ message: 'canView tidak boleh kosong' })
	@ApiProperty({ description: 'canView', type: Boolean })
	canView?: boolean;

	@Validators.IsBoolean()
	@Validators.IsNotEmpty({ message: 'canAdd tidak boleh kosong' })
	@ApiProperty({ description: 'canAdd', type: Boolean })
	canAdd?: boolean;

	@Validators.IsBoolean()
	@Validators.IsNotEmpty({ message: 'canEdit tidak boleh kosong' })
	@ApiProperty({ description: 'canEdit', type: Boolean })
	canEdit?: boolean;

	@Validators.IsBoolean()
	@Validators.IsNotEmpty({ message: 'canDelete tidak boleh kosong' })
	@ApiProperty({ description: 'canDelete', type: Boolean })
	canDelete?: boolean;

	@Validators.IsBoolean()
	@Validators.IsNotEmpty({ message: 'canApprove tidak boleh kosong' })
	@ApiProperty({ description: 'canApprove', type: Boolean })
	canApprove?: boolean;
}
