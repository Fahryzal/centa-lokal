export interface BarangJadiType {
  finishedGoodId: string;
  kodeBarang: string;
  namaBarang: string;
  quantity: number;
  kategori: string;
  unitId: string;
  unit?: string;
  satuan: string;
  nilaiSatuan: number;
  spesifikasi: string;
}

export interface GetBarangJadiType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataType;
}

export interface Unit {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface DataType {
  id: string;
  documentCode: string;
  documentNumber: string;
  date: Date;
  status: 'DRAFT' | 'POSTED' | 'POSTING' | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  items: ItemsType[];
  unit: Unit;
}

export interface ItemsType {
  id: string;
  receiptId: string;
  finishedGoodId: string;
  quantity: number;
  Satuan: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  productionIssueId: null;
  unit: Unit | string;
  finishedGood: BarangJadiType;
}

export interface PayloadBarangJadiType {
  documentCode: string;
  documentNumber: string;
  unitId: string;
  date: string;
  items: ItemType[];
}

export interface ItemType {
  quantity: number;
  satuan: string;
  spesifikasi: string;
  finishedGoodId: string;
  nilaiSatuan: number;
  namaBarang: string;
  kodeBarang: string;
  kategori: string;
  unitId: string;
}

export interface PenerimaanBarangItemPayload {
  quantity: number;
  satuan: string;
  spesifikasi: string;
  finishedGoodId: string;
  nilaiSatuan: number;
  namaBarang: string;
  kodeBarang: string;
  kategori: string;
  unitId: string;
}

export interface PenerimaanBarangPayload {
  documentCode?: string;
  documentNumber?: string;
  unitId?: string;
  date?: string;
  items?: PenerimaanBarangItemPayload[];
}

export interface PenerimaanBarangParams {
  page?: number;
  limit?: number;
  date?: string | null;
  documentCode?: string | null;
  documentNumber?: string | null;
  unit?: string | null;
  status?: string | null;
}

export interface BarangJadiParams {
  page: number;
  limit: number;
  date?: string | null;
  description?: string | null;
  unit?: string | null;
  periode_month?: string | null;
  status?: string | null;
  value_rkap: string | null;
}

export interface BarangJadiStockParams {
  page: number;
  limit: number;
  kode?: string | null;
  keterangan?: string | null;
  kodeBarang?: string | null;
  kodeKategori?: string | null;
}
