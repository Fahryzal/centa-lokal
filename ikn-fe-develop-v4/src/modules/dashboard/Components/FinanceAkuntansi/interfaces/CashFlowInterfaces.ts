export interface CashFlowType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Datum[];
}

export interface Datum {
  month: string;
  year: string;
  cashIn: number;
  cashOut: number;
}
