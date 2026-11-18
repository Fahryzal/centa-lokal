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
  status?: string;
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
  isMaterial: string;
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
  isRevert: 'Y' | 'N';
  isRevertOpen: boolean;
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
