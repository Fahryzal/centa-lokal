export interface TransactionOutType {
  transactionNumber: string;
  amount: number;
  description: string;
  accountCode: string;
  bank_account_id: string;
  date: Date | string;
  taxType?: string;
  taxValue?: number;
  accounIdTax: string;
  unit: string;
  to?: string;
  address: string;
}
