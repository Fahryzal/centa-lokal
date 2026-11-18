export interface SalesReporRNtInterfaces {
  id: string;
  purchaseOrderId: string;
  quantity: number;
  orderNumber: null;
  orderDate: null;
  unitPrice: null;
  total: number;
  stockProduct: number;
  priceProduct: number;
  kodeBarangProduct: string;
  namabarangProduct: string;
  spesifikasiProduct: string;
  beratproduct: number;
  kategoriProduct: string;
  satuanProduct: string;
  unitProduct: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  productId: string;
  purchaseOrder: PurchaseOrder;
  customerName: string;
  date: Date;
  tanggalPengiriman: Date;
}

export interface PurchaseOrder {
  id: string;
  customerId: string;
  staffId: string;
  orderNumber: string;
  date: Date;
  description: string;
  franco: string;
  fileUrl: string;
  approvedFile: null;
  customerName: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  typePo: string;
  createdAt: Date;
  updatedAt: Date;
  postedAt: null;
  deletedAt: null;
  fileUrlSigned: null;
  isCekPajak: boolean;
  selectionStatus: string;
  selectionStatusInvoice: string;
}
