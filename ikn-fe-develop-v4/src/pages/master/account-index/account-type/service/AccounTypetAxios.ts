import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as AccountTypeInterfaces from '@pages/master/account-index/account-type/interface/AccountTypeInterfaces';

export const posAccountType = async (data: AccountTypeInterfaces.PayloadType) => {
  try {
    const result = await api.post(`/api/v1/master/akun-type`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateAccountType = async (id: string, data: AccountTypeInterfaces.PayloadType) => {
  try {
    const result = await api.patch(`/api/v1/master/akun-type/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

interface ParamsType {
  page?: number;
  limit?: number;
  kode?: string | null;
  nama?: string | null;
  type: string;
}

export const fetchDataAccountType = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);

  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/master/akun-type?${queryString}`);
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataAccountTypeById = async (id: string) => {
  try {
    const data = await api.get(`/api/v1/master/akun-type/${id}`);
    return data.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const deleteAccountType = async (id: string) => {
  try {
    return await api.delete(`/api/v1/master/akun-type/${id}`);
  } catch (e: any) {
    ThrowError(e);
  }
};
