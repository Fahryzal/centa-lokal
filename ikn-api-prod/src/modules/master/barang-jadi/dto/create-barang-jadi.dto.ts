import { ApiProperty } from '@nestjs/swagger';
import * as Validators from 'class-validator';
export class CreateBarangJadiDto {
	@Validators.IsString({ message: 'kode barang harus string' })
	@Validators.IsNotEmpty({ message: 'kode barang tidak boleh kosong' })
	@ApiProperty({ description: 'kode barang', type: String, example: 'BRG-0001' })
	kodeBarang: string;

	@Validators.IsString({ message: 'nama barang harus string' })
	@Validators.IsNotEmpty({ message: 'nama barang tidak boleh kosong' })
	@ApiProperty({ description: 'nama barang', type: String, example: 'Barang example' })
	namaBarang: string;

	@Validators.IsString({ message: 'satuan harus string' })
	@Validators.IsNotEmpty({ message: 'satuan tidak boleh kosong' })
	@ApiProperty({ description: 'satuan', type: String, example: 'satuan' })
	satuan: string;

	@Validators.IsString({ message: 'kategori harus string' })
	@Validators.IsNotEmpty({ message: 'kategori tidak boleh kosong' })
	@ApiProperty({ description: 'kategori', type: String, example: 'kategori' })
	kategori: string;

	@Validators.IsNumber()
	@Validators.IsNotEmpty({ message: 'nilaiSatuan tidak boleh kosong' })
	@ApiProperty({ description: 'nilaiSatuan', type: Number, example: 0 })
	nilaiSatuan: number;
}
