import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';

export const fetchGenCodeSpbs = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/spb`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posSpbs = async (data: any) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/spbs`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posSpbsRN = async (data: any) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/spbs/rn`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posSpbsRNEkspor = async (data: any) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/spbs/rn-ekspor`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateSpbs = async (id: string, data: any) => {
  try {
    const result = await api.patch(`/api/v1/akuntansi/spbs/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

interface ParamsType {
  page: number;
  limit: number;
  date?: string | null;
  description?: string | null;
  unit?: string | null;
  periode_month?: string | null;
  status?: string | null;
  typeSalesSPb: string;
}

export const fetchDataSpbs = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/akuntansi/spbs?${queryString}`);
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataSpbsById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/akuntansi/spbs/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataStokLogByOrderNumber = async (orderNumber: string) => {
  try {
    const result = await api.get(
      `/api/v1/akuntansi/spbs/stok-log/${encodeURIComponent(orderNumber)}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delSpbs = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/akuntansi/spbs/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataUnit = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/master/unit?${queryString}`);
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataSatuan = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/master/satuan?${queryString}`);
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchGenCodePo = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/po`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataCustomer = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(`/api/v1/master/customer?${queryString}`);
  } catch (e) {
    ThrowError(e);
  }
};
