import { PartialType } from '@nestjs/swagger';
import { CreateBarangMentahDto } from './create-barang-mentah.dto';

export class UpdateBarangMentahDto extends PartialType(CreateBarangMentahDto) {}
