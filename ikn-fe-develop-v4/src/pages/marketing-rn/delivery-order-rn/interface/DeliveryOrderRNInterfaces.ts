export interface DeliveryOrderRNType {
  data: DatumType[];
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
}

export interface DatumType {
  id: string;
  customerId: string;
  staffId: string;
  orderNumber: string;
  date: Date;
  description: string;
  franco: string;
  fileUrl: string;
  subtotalAmount: number;
  approvedFile: null;
  customerName: string;
  status: string;
  typePo: string;
  createdAt: Date;
  updatedAt: Date;
  postedAt: null;
  deletedAt: null;
  fileUrlSigned: null;
  selectionStatus: string;
  selectionStatusInvoice: string;
  items: ItemType[];
  additionalCharges: AdditionalChargesType[];
}

export interface AdditionalChargesType {
  id: string;
  purchaseOrderId: string;
  amount: number;
  description: string;
  type: string;
}

export interface PurchaseOrderType {
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
  address: string;
  subtotalAmount: number;
  taxAmount: number | null;
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
  customer: CustomerType;
  items: ItemType[];
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
  deletedAt: null;
  createdAt: Date;
}

export interface ItemType {
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
  unitPrice: null;
  unitProduct: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  productId: string;
  product: ProductType;
}

export interface ProductType {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  satuan: string;
  Unit: string;
  kategori: string;
  nilaiSatuan: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface PayloadDORN {
  purchaseOrderId: string;
  status?: string;
  typeSalesDelivery: SalesDeliveryType;
}

export type SalesDeliveryType = 'RA' | 'RN' | 'RN_EKSPOR';
