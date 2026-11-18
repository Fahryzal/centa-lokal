import { UnitType } from '@pages/master/unit/interface/UnitInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';

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

export const posUnit = async (data: UnitType) => {
  try {
    const result = await api.post(`/api/v1/master/unit`, data);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateUnit = async (id: string, data: UnitType) => {
  try {
    const result = await api.patch(`/api/v1/master/unit/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

interface ParamsType {
  page: number;
  limit: number;
  kode?: string | null;
  nama?: string | null;
}

export const fetchDataUnit = async (params: ParamsType) => {
  const removeKeys = ['data', 'total', 'dataUnit']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);

  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/master/unit?${queryString}`);
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataUnitById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/master/unit/${id}`);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delUnit = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/master/unit/${id}`);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
