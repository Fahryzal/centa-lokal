export interface SpbsType {
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
  taxAmount: null;
  totalAmount: null;
  isComplete: string;
  tanggalPengiriman: Date;
  selectionStatus: string;
  typeSalesSPb: string;
  createdAt: Date;
  status: string;
  deletedAt: null;
  purchaseOrder: PurchaseOrderType;
  itemsSPB: ItemsSPBType[];
  isLocked: string;
}

export interface ItemsSPBType {
  id: string;
  spbId: string;
  productId: string;
  quantity: number;
  qtyKirim?: number | null;
  unitPrice: null;
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
  timestamp: Date;
  date: Date;
  deletedAt: null;
  namaAtasan?: string | null;
  jabatanAtasan?: string | null;
  dikirimDengan?: string | null;
}

export interface PurchaseOrderType {
  id: string;
  customerId: string;
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
  createdAt: Date;
  updatedAt: Date;
  postedAt: null;
  deletedAt: null;
  fileUrlSigned: null;
  materialRequestId: null;
  customer: CustomerType;
  items: ItemType[];
  typeSalesDelivery: string;
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
  itemCode: null;
  itemName: null;
  unit: null;
  quantity: number;
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
  Product: ProductType;
}

export interface ProductType {
  id: string;
  stock: number;
  price: number;
  kodeKategori: string;
  kodeBarang: string;
  namaBarang: string;
  spesifikasi: string;
  kodeSatuan: string;
  kodeUnit: string;
  berat: number;
  namaKategori: string;
  satuanProduct: string;
  unitProduct: string;
  deletedAt: null;
  createdAt: Date;
}

export interface PayloadSpbPosType {
  purchaseOrderId: string;
  noSpb: string;
  deliveryOrderId: string;
  orderNumber: string;
  date: string;
  description: string;
  franco: string;
  namaAtasan?: string;
  jabatanAtasan?: string;
  dikirimDengan?: string;
  customerName: string;
  subtotalAmount: number;
  totalAmount: number;
  tanggalPengiriman: string;
  stockLogs: StockLogType[];
  typeSalesSPb: 'RA' | 'RN' | 'RN_EKSPOR';
}

export interface StockLogType {
  productId: string;
  quantity: number;
  stockProduct: string;
  priceProduct: string;
  kodeBarangProduct: string;
  namabarangProduct: string;
  spesifikasiProduct: string;
  beratproduct: string;
  total: number;
  kategoriProduct: string;
  satuanProduct: string;
  unitProduct: string;
  type: string;
  nilaiSatuan: number;
  namabarangProductInvoice: string;
}

export interface DeliverySpbType {
  id: string;
  purchaseOrderId: string;
  au58Id: null;
  shippedAt: null;
  deliveredAt: null;
  typeSalesDelivery: string;
  status: string;
  selectionStatus: string;
  deletedAt: null;
  createdAt: Date;
  purchaseOrder: PurchaseOrder;
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
  deletedAt: null;
  createdAt: Date;
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
  unitPrice: null;
  unitProduct: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  productId: string;
  product: Product;
}

export interface Product {
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
