export interface DateInterfaces {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Data;
}

export interface Data {
  data: Datum[];
  totalData: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Datum {
  id: string;
  itemCode: string;
  itemName: string;
  unitId: string;
  satuan: string;
  accountCode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  unit: Unit;
  account: { [key: string]: null | string };
}

export interface Unit {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}
