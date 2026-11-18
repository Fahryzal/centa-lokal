export interface PayloadInvoiceEksporType {
  invoiceNumber: string;
  proformaNumber: string;
  date: Date;
  purchaseOrder: string;
  customerId: string;
  totalCIF: number;
  currency: string;
  description: string;
  shippingInfo: ShippingInfoType;
  items: ItemType[];
  costSummary: CostSummaryType;
  incoterms: 'CIF' | 'FOB';
  typePayment?:
    | 'DOWNPAYMENT'
    | 'FULLPAYMENT_BEFORE_INVOICE'
    | 'FULLPAYMENT_AFTER_INVOICE'
    | 'OTHER';
  downPayment?: number;
  fileUrl: any;
  customerName: string;
  address: string;
  fileUrlRes: string;
  noSpb: string;
  spbId: string;
  additionalCharges: any;
  donwPayement: number;
}

export interface CostSummaryType {
  fob: number;
  insurance: number;
  freight: number;
  amount: number;
  description: string;
  type: string;
}

export interface ItemType {
  markNo: string;
  palletNo: string;
  batchNo: string;
  bagsPerPallet: number;
  nettWeight: number;
  unitPrice: number;
  amount: number;
  description: string;
  orderNumber: string;
  quantity: number;
  orderDate: Date;
  total: number;
  kodeBarangProduct: string;
  namabarangProduct: string;
  kategoriProduct: string;
  satuanProduct: string;
  priceProduct: number;
  beratproduct: number;
}

export interface ShippingInfoType {
  vesselName: string;
  sailingDate: Date;
  loadingPort: string;
  destinationPort: string;
  lcNumber: string;
  issuedBy: string;
}

export interface ResponseDataType {
  id: string;
  invoiceNumber: string;
  proformaNumber: string;
  date: Date;
  purchaseOrder: string;
  customerId: string;
  shippingInfoId: string;
  incoterms: string;
  status: string;
  staffId: string;
  totalCIF: number;
  typePayment: string;
  downPayment: null;
  paymentDate: null;
  masterUnitId: null;
  currency: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  customerName: CustomerType;
}

export interface CustomerType {
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

export interface ResponseDataDetailType {
  id: string;
  invoiceNumber: string;
  proformaNumber: string;
  date: Date;
  purchaseOrder: string;
  customerId: string;
  shippingInfoId: string;
  incoterms: string;
  status: string;
  staffId: string;
  totalCIF: number;
  typePayment: string;
  downPayment: null;
  paymentDate: null;
  masterUnitId: null;
  currency: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  customer: CustomerType;
  shippingInfo: ShippingInfoType;
  items: Item[];
  costSummary: CostSummaryType[];
  fileUrl: string;
  fileUrlRes: string;
  donePayment: number;
}

export interface Item {
  id: string;
  invoiceId: string;
  markNo: string;
  palletNo: string;
  batchNo: string;
  bagsPerPallet: number;
  nettWeight: number;
  unitPrice: number;
  quantity: number;
  kodeBarangProduct: string;
  namabarangProduct: string;
  kategoriProduct: string;
  satuanProduct: string;
  unitProduct: string;
  beratproduct: number;
  stockProduct: number;
  nilaiSatuan: number;
  priceProduct: number;
  description: string;
  deletedAt: null;
}
