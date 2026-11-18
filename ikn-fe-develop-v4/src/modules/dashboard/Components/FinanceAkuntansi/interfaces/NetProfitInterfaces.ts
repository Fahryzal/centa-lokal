export interface NetProfitType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Datum[];
}

export interface Datum {
  month: string;
  year: string;
  product: string;
  netProfit: number;
}
