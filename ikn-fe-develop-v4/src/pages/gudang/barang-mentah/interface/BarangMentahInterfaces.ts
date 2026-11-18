export interface BarangMentahType {
  masterRawMaterialId: string;
  kodeBarang: string;
  namaBarang: string;
  quantity: number;
  kategori: string;
  unit: string;
  satuan: string;
}

export interface GetBarangMentahType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataType;
}

export interface DataType {
  id: string;
  documentCode: string;
  documentNo: string;
  date: Date;
  supplier: string;
  unit: string;
  items: ItemsType[];
}

export interface ItemsType {
  masterRawMaterialId: string;
  quantity: number;
  Satuan: string;
  nilaiSatuan: number;
  masterRawMaterial: BarangMentahType[];
  Total: number;
  hargaTotal: number;
  accountCode: string;
  accountName: string;
}

export interface UpdateBarangMentahItemPayload {
  masterRawMaterialId: string;
  quantity: number;
  Satuan: string;
  nilaiSatuan: number;
  accountCode: string;
  accountName: string;
}

export interface UpdateBarangMentahPayload {
  documentCode?: string;
  documentNo?: string;
  idSupplier?: string;
  date?: string | Date;
  faktur?: string;
  noRekening?: string;
  pengadaanBarang?: string;
  accountCode?: string;
  simpanKeBarangJadi?: boolean;
  items?: UpdateBarangMentahItemPayload[];
}
