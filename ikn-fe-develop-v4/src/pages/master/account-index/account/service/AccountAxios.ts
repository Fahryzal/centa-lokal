import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';
export const fetchGenCodeUnit = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/unit`);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posAccount = async (
  data: Omit<AccountInterfaces.AccountTypePosType, 'parentName'>
) => {
  try {
    const result = await api.post(`/api/v1/master/account`, data);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateAccount = async (id: string, data: any) => {
  try {
    const result = await api.patch(`/api/v1/master/account/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
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
  accountTypeName?: string;
  code?: string;
}

export const fetchDataAccount = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);

  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/master/account?${queryString}`);
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataUnitById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/master/account/${id}`);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delData = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/master/account/${id}`);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
