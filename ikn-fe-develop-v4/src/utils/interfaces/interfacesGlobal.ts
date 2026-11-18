export interface ResponseJwtType {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  nik: string;
  jabatan: string;
  deletedAt: null;
  roles: string[];
  iat: number;
  exp: number;
}

export interface ProductType {
  id: string;
  receiptId: string;
  finishedGoodId: string;
  quantity: number;
  Satuan: string;
  nilaiSatuan: number;
  stok: number;
  stock: number;
  stokTerkini: number;
  spesifikasi: string;
  Total: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  productionIssueId: null;
  unit: string;
  unitNama: string;
  kategori: string;
  kodeBarang: string;
  namaBarang: string;
  berat: number;
  price: number;
  unitProduct: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: T;
}

export interface AxiosResponseWithData<T> {
  data: ApiResponse<T>;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export interface DecodeTokenType {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  nik: string;
  jabatan: string;
  refreshToken: null;
  deletedAt: null;
  roles: string[];
  recaptchaToken: string;
}

export interface DataTypeCustomer {
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
}
