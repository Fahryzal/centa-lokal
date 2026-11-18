import { Dayjs } from 'dayjs';

export interface TransactionOutType {
  transactionNumber: string;
  amount: number;
  description: string;
  accountCode: string;
  bank_account_id: string;
  date: Dayjs | string;
  taxType?: string;
  taxValue?: number;
  accounIdTax: string;
  unit: string;
  to?: string;
  address: string;
  materialId: string;
  BankaccountCode: string;
  payAmount: number;
}

export interface ResponseBankType {
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
  period: string;
  isPosted: string;
  staffId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  account: Account;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  parentName: string;
  accountTypeId: string;
  parentId: string;
  isLocked: string;
  typeNeraca: string;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
  staffId: string;
}

export interface CashBankTransactionDetails {
  id: string;
  cashBankTransactionId: string;
  keterangan: string;
  unitId: string;
  accountCode: string;
  accountName: string;
  debit: string;
  credit: string;
  deletedAt: null;
  createdAt: Date;
}
