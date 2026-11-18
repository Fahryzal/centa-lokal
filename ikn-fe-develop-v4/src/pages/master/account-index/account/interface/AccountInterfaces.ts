export interface AccountParentType {
  id: string;
  code: string;
  name: string;
  accountTypeId: string;
  parentId: null;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
  accountType: AccountType;
  typeNeraca: string;
  parentName: string;
  isLocked: string;
  accountTypeName: string;
}

export interface AccountType {
  id: string;
  name: string;
  code: string;
  normalBalance: string;
  description: string;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
  parentId: string;
  type: string;
  isLocked: string;
}

export interface AccountTypePosType {
  name: string;
  parentId: string;
  parentName: string;
  accountTypeId: string;
  code: string;
  isLocked: 'N' | 'Y';
}
