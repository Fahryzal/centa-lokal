export interface OrderRNInterfacesHistory {
  id: string;
  customerId: string;
  staffId: string;
  orderNumber: string;
  date: Date;
  description: string;
  franco: string;
  fileUrl: string;
  fileUrlKontrak: string;
  fileUrlEkspor: null;
  fileUrlProduksi: null;
  fileUrlBl: null;
  subtotalAmount: number;
  approvedFile: null;
  customerName: string;
  incoterms: string;
  status: string;
  typePo: string;
  typePayment: string;
  downPayment: string;
  currency: string;
  unitId: string;
  createdAt: Date;
  updatedAt: Date;
  postedAt: null;
  deletedAt: null;
  fileUrlSigned: null;
  selectionStatus: string;
  selectionStatusInvoice: string;
  taxAmount: string;
  totalAmount: string;
  cekPajak: string;
  items: Item[];
  additionalCharges: any[];
  PurchaseOrderTax: PurchaseOrderTax[];
}

export interface PurchaseOrderTax {
  id: string;
  purchaseOrderId: string;
  taxId: string;
  taxType: string;
  taxValue: number;
  taxAmount: number;
  accountCode: null;
  createdAt: Date;
  deletedAt: null;
}

export interface Item {
  id: string;
  purchaseOrderId: string;
  quantity: number;
  orderNumber: string;
  orderDate: Date;
  total: number;
  stockProduct: number;
  priceProduct: number;
  kodeBarangProduct: string;
  namabarangProduct: string;
  namabarangProductInvoice: string;
  spesifikasiProduct: string;
  beratproduct: number;
  kategoriProduct: string;
  satuanProduct: string;
  unitPrice: string;
  unitProduct: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  productId: string;
}
