import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import { PayloadAddUser } from '../structure/interfaces/interfaces';
import {
  DataResultType,
  DataUsersType,
  ParamsUserManagementType,
  // ResultUsersType,
} from '../interface/UsermanagementInterfaces';

export const fetchGenCodeSatuan = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/satuan`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posUserManagement = async (data: PayloadAddUser) => {
  try {
    const result = await api.post(`/api/v1/user-management/users`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateUserManagement = async (id: string, data: PayloadAddUser) => {
  try {
    const result = await api.patch(`/api/v1/user-management/users/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataUserManagement = async (
  params: ParamsUserManagementType
): Promise<DataResultType | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get<DataUsersType>(`/api/v1/user-management/users?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataUserManagementById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/user-management/users/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delUserManagamenent = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/user-management/users/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataRoles = async (params: ParamsUserManagementType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/user-management/users/roles?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};
