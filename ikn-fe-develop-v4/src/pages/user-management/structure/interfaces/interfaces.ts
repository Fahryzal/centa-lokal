export interface PayloadAddUser {
  email: string;
  password: string;
  name: string;
  nik: string;
  unitID: string;
  jabatan: string;
  isPusat: boolean;
  isRoot: string;
  roleIds: number[];
}
