export interface BarangJadi {
  code: string;
  nama: string;
}
export interface ParamsType {
  page: number;
  limit: number;
  kode?: string | null;
  keterangan?: string | null;
  kodeBarang?: string | null;
  kodeKategori?: string | null;
  namaBarang?: string | null;
}

export interface DatBarangJadi {
  data: WelcomeData;
  status: number;
  statusText: string;
  config: Config;
  request: Request;
}

export interface Config {
  transitional: Transitional;
  adapter: string[];
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Request;
  headers: ConfigHeaders;
  baseURL: string;
  withCredentials: boolean;
  method: string;
  url: string;
  allowAbsoluteUrls: boolean;
}

export interface ConfigHeaders {
  Accept: string;
  Authorization: string;
}

export interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

export interface WelcomeData {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataData;
}

export interface DataData {
  data: Datum[];
  totalData: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Datum {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  satuan: string;
  kategori: string;
  nilaiSatuan: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  staffId: string;
}
