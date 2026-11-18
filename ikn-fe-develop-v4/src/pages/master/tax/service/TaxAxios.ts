import { TaxtType } from '@pages/master/tax/interface/TaxInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';

export const posTax = async (data: TaxtType) => {
  try {
    const result = await api.post(`/api/v1/master/tax`, data);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateTax = async (id: string, data: TaxtType) => {
  try {
    const result = await api.patch(`/api/v1/master/tax/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataTaxById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/master/tax/${id}`);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delTax = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/master/tax/${id}`);
    if (![200, 201].includes(result.status)) {
      throw 'Terjadi kesalahan';
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

interface ParamsPajakType {
  page: number;
  limit: number;
  taxType?: string | null;
  taxValue?: number | null;
  taxAmount?: number | null;
}

export const fetchDataPajak = async (params: ParamsPajakType) => {
  const removeKeys = ['data', 'total', 'sortOrder']; // Properti yang ingin dihapus

  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/master/tax?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};
