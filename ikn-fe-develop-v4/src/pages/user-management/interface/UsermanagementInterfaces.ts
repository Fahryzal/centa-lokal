export interface ParamsUserManagementType {
  page: number;
  limit: number;
  kode?: string | null;
  keterangan?: string | null;
}
export interface ResultUsersType {
  data: DataUsersType;
  status: number;
  statusText: string;
  headers: RequestHeadersType;
  config: ConfigType;
}

export interface ConfigType {
  transitional: TransitionalType;
  adapter: string[];
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
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

export interface TransitionalType {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

export interface DataUsersType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataResultType;
}

export interface DataResultType {
  data: DatumType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DatumType {
  id: string;
  name: string;
  email: string;
  jabatan: string;
  nik: string;
  roles: string[];
  permisions: Permisions;
}

export interface Permisions {
  role: Role;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface Permission {
  roleId: number;
  menuId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  createdAt: Date;
  deletedAt: null;
}

export interface RequestHeadersType {
  'access-control-allow-credentials': string;
  'access-control-allow-origin': string;
  connection: string;
  'content-encoding': string;
  'content-security-policy': string;
  'content-type': string;
  'cross-origin-opener-policy': string;
  'cross-origin-resource-policy': string;
  date: string;
  etag: string;
  'origin-agent-cluster': string;
  'referrer-policy': string;
  'strict-transport-security': string;
  'transfer-encoding': string;
  vary: string;
  'x-content-type-options': string;
  'x-dns-prefetch-control': string;
  'x-download-options': string;
  'x-frame-options': string;
  'x-permitted-cross-domain-policies': string;
  'x-xss-protection': string;
}
