export interface DataProductIvent {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Datum[];
}

export interface Datum {
  type: Type;
  date: Date;
  qty: number;
  product: string;
}

export enum Type {
  Keluar = 'Keluar',
  Masuk = 'Masuk',
}
