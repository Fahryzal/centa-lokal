export interface SalesReportRaExcelInterfaces {
  id: string;
  spbId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  total: number;
  orderNumber: string;
  customerName: string;
  stockProduct: number;
  priceProduct: number;
  kodeBarangProduct: string;
  namabarangProduct: string;
  namabarangProductInvoice: string;
  spesifikasiProduct: string;
  beratproduct: number;
  kategoriProduct: string;
  satuanProduct: string;
  unitProduct: string;
  isCekPajak: boolean;
  typeSalesSPb: string;
  timestamp: Date;
  date: Date;
  deletedAt: null;
  createdAt: Date;
  spb: Spb;
}

export interface Spb {
  id: string;
  noSpb: string;
  purchaseOrderId: string;
  orderNumber: string;
  date: Date;
  description: string;
  franco: string;
  fileUrl: null;
  customerName: string;
  subtotalAmount: number;
  taxAmount: string;
  totalAmount: string;
  unitId: string;
  isComplete: string;
  isCekPajak: boolean;
  tanggalPengiriman: Date;
  selectionStatus: string;
  typeSalesSPb: string;
  createdAt: Date;
  status: string;
  staffId: string;
  deletedAt: null;
  invoice: Invoice;
  invoiceEkspor: null;
  purchaseOrder: PurchaseOrder;
}

export interface Invoice {
  id: string;
  spbId: string;
  contractId: null;
  invoiceNumber: string;
  invoiceDate: Date;
  amountWithTax: number;
  totalAmount: number;
  downPayment: null;
  createdAt: Date;
  deletedAt: null;
  selectionStatus: string;
  typeInvoice: string;
  paymentDate: null;
  status: string;
  userId: null;
  masterUnitId: string;
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
  fileUrlKontrak: null;
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
}
