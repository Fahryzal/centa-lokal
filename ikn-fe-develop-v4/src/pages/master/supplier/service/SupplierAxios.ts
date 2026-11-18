import * as SupplierInterfaces from '@/pages/master/supplier/interface/SupplierInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';

export const posSupplier = async (data: SupplierInterfaces.SupplierType) => {
  try {
    const result = await api.post(`/api/v1/master/supplier`, data);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

export const updateSupplier = async (id: string, data: SupplierInterfaces.SupplierType) => {
  try {
    const result = await api.patch(`/api/v1/master/supplier/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

interface ParamsType {
  page: number;
  limit: number;
  kode?: string | null;
  nama?: string | null;
}

export const fetchDataSupplier = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/master/supplier?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result;
  } catch (e) {
    ThrowError(e);
  }
};

export const fetchDataSupplierById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/master/supplier/${id}`);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

export const delSupplier = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/master/supplier/${id}`);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};
