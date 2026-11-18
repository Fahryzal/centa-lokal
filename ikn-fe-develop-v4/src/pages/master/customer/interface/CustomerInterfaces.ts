export interface CusomersType {
  code: string;
  nama: string;
}
export interface ParamsType {
  page: number;
  limit: number;
  kode?: string | null;
  nama?: string | null;
  name?: string | null;
}

export interface CusomersData {
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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Datum {
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
