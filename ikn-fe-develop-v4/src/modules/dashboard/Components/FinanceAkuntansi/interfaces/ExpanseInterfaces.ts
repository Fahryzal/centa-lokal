export interface ExpanseInterfaces {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Datum[];
}

export interface Datum {
  accountCode: string;
  category: string;
  value: number;
  year: string;
  parentId: string | null;
}
