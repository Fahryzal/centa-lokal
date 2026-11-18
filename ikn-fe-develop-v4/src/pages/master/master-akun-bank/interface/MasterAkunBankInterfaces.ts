import { Dayjs } from 'dayjs';

export interface MasterAkunBank {
  code: string;
  nama: string;
}
export interface ParamsBankAccountType {
  page: number;
  limit: number;
  code?: string | null;
  bankAccountNumber?: string | null;
}

export interface ParamsBankAccountTypeGenCode {
  bankAccountId?: string;
  tanggal: Date;
}

export interface DataBankAccountType {
  id: string;
  accountCode: string;
  bankName: string;
  bankCode: string;
  currency: string;
  branchAddress: string;
  currencyRate: any;
  bankAccountNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  account: {
    id: string;
    code: string;
    name: string;
    type: string;
    isLocked: string;
    parentId: string;
    deletedAt: any;
    createdAt: string;
    updatedAt: string;
  };
  unit: Unit;
}

export interface Unit {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface PayloadType {
  bankAccountNumber: string;
  bankName: string;
  bankCode: string;
  branchAddress: string;
  accountCode: string;
  initialBalance: number;
  date: Dayjs | string;
  unitId: string;
  details: Detail[];
}

export interface Detail {
  unitId: string;
  accountCode: string;
  debit: string;
  credit: string;
  fiscalYear: string;
}

export interface AccountBankDetailType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataDetail;
}

export interface DataDetail {
  id: string;
  accountCode: string;
  bankName: string;
  bankCode: string;
  currency: string;
  branchAddress: string;
  currencyRate: string;
  bankAccountNumber: string;
  initialBalance: number;
  currentBalance: number;
  date: Date;
  unitId: string;
  staffId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  isPosted: 'Y' | 'N';
  OpeningBankDetails: OpeningBankDetails[];
  unit: UnitType;
}

export interface UnitType {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface OpeningBankDetails {
  id: string;
  headerId: string;
  unitId: string;
  accountCode: string;
  staffId: string;
  debit: number;
  credit: number;
  fiscalYear: string;
  deletedAt: null;
  createdAt: null;
  account: Account;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  parentName: null;
  accountTypeId: string;
  parentId: string;
  isLocked: string;
  typeNeraca: string;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
  staffId: string;
}

export interface DataAllAccoutBankType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Data;
}

export interface Data {
  data: Datum[];
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
}

export interface Datum {
  id: string;
  accountCode: string;
  bankName: string;
  bankCode: string;
  currency: string;
  branchAddress: string;
  currencyRate: string;
  bankAccountNumber: string;
  initialBalance: number;
  currentBalance: number;
  date: Date;
  unitId: string;
  staffId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  account: Account;
  isPosted: 'Y' | 'N';
}

export interface Account {
  id: string;
  code: string;
  name: string;
  parentName: null;
  accountTypeId: string;
  parentId: string;
  isLocked: string;
  typeNeraca: string;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
  staffId: string;
}
