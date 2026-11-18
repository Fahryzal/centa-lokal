import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import * as OpeningBalanceInterfaces from '@pages/akuntansi/opening-balance/interfaces/OpeningBalanceInterfaces';

export const posOpeningBalance = async (payload: OpeningBalanceInterfaces.OpeningBalanceType) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/opening-balance`, payload);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};

interface ParamsType {
  page: number;
  limit: number;
  date?: string | null;
  status?: string | null;
}

export const fetchDataOpeningBalance = async (
  params: ParamsType
): Promise<OpeningBalanceInterfaces.GetOpeningBalanceType | undefined> => {
  const removeKeys = ['data', 'total', 'totalData']; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/akuntansi/opening-balance?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchOpeningBalanaceDetail = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/akuntansi/opening-balance/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posPostingOpeningBalance = async (id: string) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/opening-balance/posting/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};

export const putOpeningBalance = async (id: string, data: any) => {
  try {
    const result = await api.patch(`/api/v1/akuntansi/opening-balance/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};

export const delOpeningBalance = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/akuntansi/opening-balance/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};
