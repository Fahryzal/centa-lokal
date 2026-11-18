export interface ResponseDetailJurnal {
  referenceNumber: string;
  numberJurnal: string;
  journalId: string;
  date: Date;
  description: string;
  accountCode: string;
  accountName: string;
  debit: string;
  credit: string;
  kodeAccount: string;
  creditDollar: string;
  debitDollar: string;
  supplier: string;
  spb: null;
  transaction: TransactionType;
}

export interface TransactionType {
  id: string;
  documentCode: string;
  documentNo: string;
  supplierId: string;
  noRekening: string;
  pengadaanBarang: string;
  faktur: string;
  unitId: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  items: ItemType[];
  supplier: SupplierType;
}

export interface ItemType {
  id: string;
  receiptId: string;
  masterRawMaterialId: string;
  nilaiSatuan: number;
  quantity: number;
  satuan: string;
  stok: number;
  Total: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface SupplierType {
  id: string;
  nomorPengenal: string;
  namaRekanan: string;
  alamatRekanan: string;
  createdAt: Date;
  deletedAt: null;
  accountCode: string;
  code: string;
}
