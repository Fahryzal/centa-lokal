import { Dayjs } from 'dayjs';

export interface JurnalUmumInterface {
  numberJurnal: string;
  module: string;
  description: string;
  referenceNumber: string;
  date: Dayjs | string;
  unitId: string;
  typeJournalEntry?: string;
  details: Detail[];
}

export interface Detail {
  unit: string;
  accountCode: string;
  debit: string;
  credit: string;
}

export interface GenerateCodeResponse {
  code: string;
}

export interface JurnalUmumDetailInterface {
  referenceNumber: string;
  numberJurnal: string;
  journalId: string;
  date: Date;
  description: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  kodeAccount: string;
}
