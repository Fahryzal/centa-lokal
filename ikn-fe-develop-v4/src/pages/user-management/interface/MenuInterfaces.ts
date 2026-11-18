export interface MenuInterfaces {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataType | undefined;
}

export interface DataType {
  data: DatumType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DatumType {
  id: number;
  name: string;
  path: string;
  icon: null;
  createdAt: Date;
  deletedAt: null;
  parentId: number | null;
  nameParent: string;
}

export interface PayloadMenuType {
  name: string;
  nameParent?: string;
  path: string;
  icon: string;
  parentId: number;
}

export interface ResponseFindOneMenu {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataFindOneMenu;
}

export interface DataFindOneMenu {
  id: number;
  name: string;
  path: string;
  icon: null;
  createdAt: Date;
  deletedAt: null;
  parentId: number;
  nameParent: string;
}
