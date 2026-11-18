export interface AccountMappingType {
  id: string;
  code: string;
  name: string;
  type: string;
  parentId: null;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountTypePosType {
  name: string;
  type: string;
  parentId: string;
  id: string;
  parentName: string;
}
