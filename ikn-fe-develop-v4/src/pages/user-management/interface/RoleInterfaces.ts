export interface RoleInterfacesType {
  success: boolean;
  status: number;
  message: string;
  timestamp: Date;
  data: DataType;
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
  createdAt: Date;
  deletedAt: null;
  permissions: PermissionType[];
}

export interface PermissionType {
  roleId: number;
  menuId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  createdAt: Date;
  deletedAt: null;
  menu: MenuType;
}

export interface MenuType {
  id: number;
  name: string;
  path: string;
  icon: null;
  createdAt: Date;
  deletedAt: null;
  parentId: number | null;
}

export interface PayloadType {
  name: string;
  rolePermission: RolePermisionType[];
}

export interface RolePermisionType {
  menuId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  nameParent?: string;
}
