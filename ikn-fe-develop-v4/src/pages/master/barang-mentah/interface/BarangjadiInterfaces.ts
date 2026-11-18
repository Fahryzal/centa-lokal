export interface RawMaterial {
  accountCode: string;
  itemCode: string;
  itemName: string;
  satuan: string;
  unit: string;
}

export interface ParamsType {
  page: number;
  limit: number;
  kode?: string | null;
  keterangan?: string | null;
  kodeBarang?: string | null;
  kodeKategori?: string | null;
}

export interface GetDataMaterial {
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
  account: Account;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  parentName: null;
  accountTypeId: string;
  parentId: null;
  isLocked: string;
  typeNeraca: string;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
  staffId: string;
}

export interface Unit {
  id: string;
  kode: string;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}
