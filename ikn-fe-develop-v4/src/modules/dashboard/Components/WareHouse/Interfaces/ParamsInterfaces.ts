import { Dayjs } from 'dayjs';

export interface ParamsType {
  page: number;
  limit: number;
  itemCode?: string | null;
  itemName?: string | null;
  unit?: string | null;
  satuan?: string | null;
  accountCode?: string | null;
  unitId: string;
  month?: number;
  year?: number;
}

export interface ParamsProductType {
  page: number;
  limit: number;
  kode?: string | null;
  keterangan?: string | null;
  kodeBarang?: string | null;
  kodeKategori?: string | null;
  namaBarang?: string | null;
  date: Dayjs;
  unit: string;
  kategori: string | null;
  Satuan: string | null;
}

export interface ParamsProductIvenType {
  productId?: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
  unitId?: string;
}
