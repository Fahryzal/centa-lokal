import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as RoleInterfaces from 'pages/user-management/interface/RoleInterfaces';

export const fetchDataRole = async (
  params?: RoleInterfaces.DatumType
): Promise<RoleInterfaces.DataType | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys((params && params) || {}, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get<RoleInterfaces.RoleInterfacesType>(
      `/api/v1/user-management/roles?${queryString}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posRoles = async (data: RoleInterfaces.PayloadType) => {
  try {
    const result = await api.post(`/api/v1/user-management/roles`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateRoles = async (id: string, data: RoleInterfaces.PayloadType) => {
  try {
    const result = await api.patch(`/api/v1/user-management/roles/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataRoleById = async (
  id: string
): Promise<RoleInterfaces.DatumType | undefined> => {
  try {
    const result = await api.get(`/api/v1/user-management/roles/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delRoles = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/user-management/roles/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
