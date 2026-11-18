export interface SupplierType {
  id: string;
  nomorPengenal: string;
  namaRekanan: string;
  alamatRekanan: string;
  account: Account;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  creditOrDebit: string;
  parentId: null;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
}
