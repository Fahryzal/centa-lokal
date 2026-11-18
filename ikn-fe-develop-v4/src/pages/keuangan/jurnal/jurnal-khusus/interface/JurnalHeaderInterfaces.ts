import { Dayjs } from 'dayjs';

export interface JurnalHeaderInterface {
  id: string;
  spbId: string;
  numberJurnal: string;
  module: string;
  transactionId: null;
  description?: string;
  purposeTransaction?: string;
  status: boolean;
  referenceNumber: string;
  createdBy: string;
  date: Dayjs | string;
  unit: UnitType;
  deletedAt: null;
  journalId: null;
  createdAt: Date;
  typeJournalEntry: string;
  purchaseOrderTaxId: null;
  sPBTaxId: null;
  isPosted: boolean;
  loading: boolean;
  details: JournalDetailType[];
  unitid: string;
  currencyValue: number;
}

export interface JournalDetailType {
  addRow: boolean;
  key: string;
  id: string;
  journalEntryId: string;
  unitId?: string | null;
  fixedAssetId: string | null;
  accountCode: string;
  debit: number;
  credit: number;
  debitDollar: number;
  creditDollar: number;
  deletedAt: string | null;
  currency: number;
  isTmp: boolean;
  account: any;
  createdAt: string;
  isNew: boolean;
  accountName: string;
  description?: string;
}

export interface UnitType {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface Payload {
  id: string;
  accountCode: string;
  debit: number;
  credit: number;
  journalEntryId?: string;
  unit: string | null | any;
  fixedAssetId?: string | null;
  deletedAt?: Date | null;
  addRow: boolean;
}

export interface JurnalKhususHeaderInterfac<T> {
  data: T[];
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  postCount: number;
}

export interface PayloadUpdateType {
  numberJurnal: string;
  description?: string;
  purposeTransaction?: string;
  referenceNumber: string;
  date: Dayjs | string | Date;
  unitId: string;
  typeJournalEntry: string;
  createdBy: string;
  details: DetailType[];
  currencyValue: number;
}

export interface DetailType {
  id: string;
  accountCode: string;
  credit: number;
  debit: number;
  journalEntryId: string;
  unitId: string;
}
