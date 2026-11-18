export interface ParamsType {
  year?: number;
  unitId?: string;
  month?: string;
  typeTransaction?: 'RA' | 'RN' | 'RN_EKSPOR';
}

export interface DataExpenseIncome {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Datum[];
}

export interface Datum {
  month: string;
  Income: number;
  Expenses: number;
  year: number;
}
