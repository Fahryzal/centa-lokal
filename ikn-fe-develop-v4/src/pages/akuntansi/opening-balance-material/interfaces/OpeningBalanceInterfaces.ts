import { Dayjs } from 'dayjs';

export interface OpeningBalanceType {
  fiscalYear: string;
  unitId: string;
  notes: string;
  date: Dayjs | string;
  unit: string;
  details: Detail[];
  loading: boolean;
  staff?: string;
}

export interface Detail {
  unitId: string;
  accountCode: string;
  debit: string;
  credit: string;
  fiscalYear: string;
}

export interface GetOpeningBalanceType {
  loading: boolean;
  data: DatumType[];
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  totalBalance: number | null;
  date: Date | null;
  status: string | null;
}

export interface DatumType {
  id: string;
  fiscalYear: string;
  unitId: string;
  staffId: string;
  status: string;
  postedAt: null;
  notes: string;
  date: Date;
  deletedAt: null;
  staff: StaffType;
  unit: UnitType;
  totalBalance: number;
}

export interface StaffType {
  id: string;
  name: string;
  email: string;
  password: string;
  nik: string;
  jabatan: string;
  refreshToken: string;
  createdAt: Date;
  deletedAt: null;
  unitId: string;
}

export interface UnitType {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface JournalEntryOpeningBalance {
  key: string;
  accountCode: string | null;
  description: string;
  debit: number;
  credit: number;
  code?: string;
  accountName: string;
  id?: string;
  isNew?: boolean;
}

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
  key: string;
  id: string;
  productId: string;
  quantity: number;
  stok: number;
  Satuan: string;
  nilaiSatuan: number;
  masterRawMaterial: BarangMentahType[];
  Total: number;
  hargaTotal: number;
  accountCode: string;
  openingId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
