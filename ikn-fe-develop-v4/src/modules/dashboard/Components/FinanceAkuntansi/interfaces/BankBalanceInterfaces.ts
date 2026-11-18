export interface BankBalanceInterfaces {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Datum[];
}

export interface Datum {
  bankName: string;
  balance: number;
  month: string;
  year: string;
}
