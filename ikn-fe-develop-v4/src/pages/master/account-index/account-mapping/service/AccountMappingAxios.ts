import { UnitType } from '@pages/master/unit/interface/UnitInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';

export const posAccountMapping = async (
  data: Omit<AccountInterfaces.AccountTypePosType, 'parentName'>
) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/account-mapping`, data);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateAccountMapping = async (id: string, data: UnitType) => {
  try {
    const result = await api.patch(`/api/v1/akuntansi/account-mapping/${id}`, data);
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
  type: string;
}

export const fetchDataAccountMapping = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);

  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/akuntansi/account-mapping?${queryString}`);
  } catch (e: any) {
    ThrowError(e);
  }
};
