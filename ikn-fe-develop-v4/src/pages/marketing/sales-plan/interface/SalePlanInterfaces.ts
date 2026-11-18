export interface SalesPlanPayloadType {
  description: string;
  staffId: string;
  status: string;
  value_rkap: number;
  periode_month: string;
  typeSalesPlan: string;
  unitId: string;
}

export interface ParamsType {
  page: number;
  limit: number;
  date?: string | null;
  description?: string | null;
  unit?: string | null;
  periode_month?: string | null;
  status?: string | null;
  value_rkap: string | null;
}

export interface SalePlanOneInterfaces {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataSalesPlanOne;
}

export interface DataSalesPlanOne {
  id: string;
  staffId: string;
  date: Date;
  description: string;
  value_rkap: number;
  unitId: string;
  periode_month: string;
  status: string;
  typeSalesPlan: string;
  deletedAt: null;
}

export interface DataSalesPlanType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Data;
}

export interface Data {
  data: Datum[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Datum {
  id: string;
  staffId: string;
  date: Date;
  description: string;
  value_rkap: string;
  unitId: string;
  periode_month: string;
  status: string;
  typeSalesPlan: string;
  deletedAt: null;
  createdAt: Date;
  unit: Unit;
}

export interface Unit {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}
