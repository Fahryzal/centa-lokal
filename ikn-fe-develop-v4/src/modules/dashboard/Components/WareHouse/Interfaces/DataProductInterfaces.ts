export interface DataProductInterfaces {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Data;
}

export interface Data {
  data: Datum[];
  totalData: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Datum {
  id: string;
  receiptId: string;
  finishedGoodId: string;
  quantity: number;
  Satuan: string;
  nilaiSatuan: number;
  stok: number;
  spesifikasi: string;
  namaBarang: string;
  kodeBarang: string;
  kategori: string;
  Total: number;
  unitId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  productionIssueId: null;
  unitNama: string;
  stokTerkini: number;
}
