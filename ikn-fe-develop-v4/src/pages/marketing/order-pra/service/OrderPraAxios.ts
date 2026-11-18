import * as OrderPraInterfaces from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';

export const fetchGenCodeOrderPra = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/barang-jadi`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posOrderPra = async (data: OrderPraInterfaces.PayloadOrderRAType) => {
  try {
    const result = await api.post(`/api/v1/marketing/order-po-pra`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateOrderPra = async (id: string, data: OrderPraInterfaces.PayloadOrderRAType) => {
  try {
    const result = await api.patch(`/api/v1/marketing/order-po-pra/${id}`, data);
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
  date?: string | null;
  status?: string | null;
  name?: string;
  invoiceSelectionStatus?: string | null;
}

interface ParamsPajakType {
  page: number;
  limit: number;
  taxType?: string | null;
  taxValue?: number | null;
  taxAmount?: number | null;
}

export const fetchDataPajak = async (params: ParamsPajakType) => {
  const removeKeys = ['data', 'total', 'sortOrder'];

  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();

  try {
    const result = await api.get(`/api/v1/keuangan/tax?${queryString}`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }

    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataOrderPra = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/marketing/order-po-pra?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataOrderPraById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/marketing/order-po-pra/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delOrderPra = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/marketing/order-po-pra/${id}`);
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
    const result = await api.get(`/api/v1/master/unit?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataSatuan = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/master/satuan?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
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
    const result = await api.get(`/api/v1/master/customer?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e) {
    ThrowError(e);
  }
};

export const uploadFileOrderPra = async (data: any) => {
  try {
    const result = await api.post(`/api/v1/files-upload/upload`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const getFileOrderPra = async (name: any) => {
  try {
    const result = await api.get(`/api/v1/files-upload/${name}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
