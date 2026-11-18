export interface ParamsType {
  page: number;
  limit: number;
  date?: string | null;
  status?: string | null;
  invoiceNumber: string | null;
  orderNumber: string | null;
  customerName: string | null;
  typeInvoice: 'RA' | 'RN';
}

export interface DataTTDType {
  bankAccountNumber: string;
  ttdName: string;
  jabatan: string;
  bankName: string;
}

export interface RaInvoiceByPurchaseOrderType {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  bankAccountId: string | null;
  namaAtasan: string | null;
  jabatanAtasan: string | null;
  BankAccount: {
    id: string;
    bankName: string;
    bankAccountNumber: string;
  } | null;
}

export interface InvoiceType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: Data;
}

export interface InvoiceDetail {
  id: string;
  invoiceId: string;
  spbId: string;
  itemsSpbId: string;
  quantity: number | null;
  unitPrice: string;
  total: number;
  createdAt: Date;
}

export interface Data {
  data: Datum[];
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
}

export interface Datum {
  id: string;
  spbId: string | null;
  contractId: null;
  invoiceNumber: string;
  invoiceDate: Date;
  amountWithTax: number;
  amountTax: number | null;
  totalAmount: number;
  createdAt: Date;
  deletedAt: null;
  selectionStatus: string;
  typeInvoice: string;
  paymentDate: null;
  status: string;
  userId: null;
  masterUnitId: string;

  invoiceTaxes: InvoiceTax[];

  InvoiceDetail: InvoiceDetail[];

  spb: Spb | null;
}

export interface InvoiceTax {
  id: string;
  invoiceId: string;
  taxId: string;
  taxType: string;
  taxValue: number;
  withheldByCustomer: boolean;
  isIncludedInPrice: boolean;
  taxAmount: number;
  createdAt: Date;
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
  itemsSPB: Item[];
  purchaseOrder: PurchaseOrder;
}

export interface Item {
  id: string;
  spbId?: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  total: number;
  orderNumber: string;
  customerName?: string;
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
  isCekPajak?: boolean;
  typeSalesSPb?: string;
  timestamp?: Date;
  date?: Date;
  deletedAt: null;
  createdAt: Date;
  purchaseOrderId?: string;
  orderDate?: Date;
  updatedAt?: Date;
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
  customer: Customer;
  items: Item[];
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  address: string;
  unit: string;
  email: string;
  phone: string;
  country: string;
  continent: string;
  regional_type: string;
  fax: null;
  staffId: string;
  deletedAt: null;
  createdAt: Date;
}
