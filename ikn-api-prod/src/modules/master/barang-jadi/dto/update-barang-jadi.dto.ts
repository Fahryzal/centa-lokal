import { PartialType } from '@nestjs/swagger';
import { CreateBarangJadiDto } from './create-barang-jadi.dto';

export class UpdateBarangJadiDto extends PartialType(CreateBarangJadiDto) {}
