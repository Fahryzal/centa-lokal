export interface SaldoKeuanganType {
  totalIn: number;
  totalOut: number;
  netCashFlow: number;
  items: ItemType[];
}

export interface ItemType {
  date: Date;
  accountName: string;
  description: string;
  amount: number;
  type: string;
}

export interface BalanceSheetType {
  asset: AssetType[];
  liability: AssetType[];
  equity: AssetType[];
  expense: AssetType[];
  revenue: AssetType[];
}

export interface AssetType {
  code: string;
  name: string;
  balance: number;
  typeNeraca: string;
}

export interface ProfieLossType {
  revenues: RevenueType[];
  expenses: any[];
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
}

export interface RevenueType {
  name: string;
  type: string;
  debit: number;
  credit: number;
}
