export interface JurnalHeaderInterface {
  id: string;
  spbId: string;
  numberJurnal: string;
  module: string;
  transactionId: null;
  description: string;
  referenceNumber: string;
  createdBy: string;
  date: Date | string;
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
  deletedAt: string | null;
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
  description: string;
  referenceNumber: string;
  date: string | Date;
  unitId: string;
  typeJournalEntry: string;
  createdBy: string;
  details: DetailType[];
}

export interface DetailType {
  id: string;
  accountCode: string;
  credit: number;
  debit: number;
  journalEntryId: string;
  unitId: string;
}
