export interface BarangMentahIssueInterfaces {
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
  id: string;
  masterRawMaterialId: string;
  quantity: number;
  Satuan: string;
  nilaiSatuan: number;
  masterRawMaterial: BarangMentahIssueInterfaces[];
}
