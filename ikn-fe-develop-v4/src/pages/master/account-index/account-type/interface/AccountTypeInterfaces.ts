export interface AccountType {
  id: string;
  name: string;
  code: string;
  normalBalance: string;
  description: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  parentName: string;
}

export interface AccountTypePosType {
  name: string;
  parentId: string;
  id: string;
  parentName: string;
  accountTypeId: string;
  code: string;
}

export interface PayloadType {
  name: string;
  code: string;
  normalBalance: string;
  description: string;
}
