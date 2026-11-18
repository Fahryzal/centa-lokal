export interface DeliveryOrderPraType {
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
  au58Id?: string;
  au58Date?: Date;
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

export interface PayloadDORA {
  purchaseOrderId: string;
  status?: string;
  typeSalesDelivery: SalesDeliveryType;
  au58Number?: string | null;
  au58Date?: string | null;
  items: {
    purchaseOrderItemId: string;
    qtyKirim: number;
  }[];
}

export interface UpdateDeliveryOrderPraItemPayload {
  purchaseOrderItemId: string;
  qtyKirim: number;
}

export interface UpdateDeliveryOrderPraPayload {
  au58Number?: string | null;
  au58Date?: string | null;

  items?: UpdateDeliveryOrderPraItemPayload[];
}

export type SalesDeliveryType = 'RA' | 'RN';
