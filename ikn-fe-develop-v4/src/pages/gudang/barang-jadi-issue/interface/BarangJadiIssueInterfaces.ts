export type FinishedGoodsIssueStatus = 'DRAFT' | 'POSTED' | 'REVERTED';

// =====================================================
// MASTER BARANG JADI
// Digunakan untuk pilihan barang pada form pengeluaran
// =====================================================

export interface BarangJadiType {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  unitId?: string;
  satuan?: string;
  nilaiSatuan: number;
  spesifikasi?: string;
}

// =====================================================
// MASTER UNIT
// =====================================================

export interface Unit {
  id: string;
  kode: string;
  nama: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
}

// =====================================================
// DETAIL PENGELUARAN BARANG JADI
// =====================================================

export interface FinishedGoodsIssueItem {
  id: string;
  issueId: string;
  finishedGoodId: string;
  quantity: number;
  Satuan: string;
  nilaiSatuan: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  finishedGood: BarangJadiType;
}

// =====================================================
// RESPONSE DETAIL DOKUMEN
// =====================================================

export interface FinishedGoodsIssueData {
  id: string;
  documentCode: string;
  documentNumber: string;
  date: Date;
  unitId: string;
  staffId: string;
  status: FinishedGoodsIssueStatus;
  diPergunakan?: string | null;
  keterangan?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  ProductionIssueItem: FinishedGoodsIssueItem[];
  unit: Unit;
}

// =====================================================
// RESPONSE API
// =====================================================

export interface GetFinishedGoodsIssueType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: FinishedGoodsIssueData;
}

// =====================================================
// PAYLOAD DETAIL CREATE
// Sesuai CreateFinishedGoodsIssueDtoItemDto backend
// =====================================================

export interface FinishedGoodsIssueItemPayload {
  finishedGoodId: string;
  quantity: number;
  Satuan: string;
}

// =====================================================
// PAYLOAD CREATE
// Sesuai CreateFinishedGoodsIssueDto backend
// =====================================================

export interface FinishedGoodsIssuePayload {
  documentCode: string;
  documentNumber: string;
  unitId: string;
  date: string;
  diPergunakan?: string;
  keterangan?: string;
  items: FinishedGoodsIssueItemPayload[];
}

// =====================================================
// PAYLOAD UPDATE
// =====================================================

export interface UpdateFinishedGoodsIssuePayload {
  documentCode?: string;
  documentNumber?: string;
  unitId?: string;
  date?: string;
  diPergunakan?: string;
  keterangan?: string;
  items?: FinishedGoodsIssueItemPayload[];
}

// =====================================================
// PARAMETER LIST DATA
// =====================================================

export interface FinishedGoodsIssueParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  date?: string | null;
  documentCode?: string | null;
  documentNumber?: string | null;
  unit?: string | null;
  status?: FinishedGoodsIssueStatus | null;
}
