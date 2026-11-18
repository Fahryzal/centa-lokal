import axios from 'axios';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import * as InvoiceEksporRNInterfaces from '@pages/marketing-rn-ekspor/invoice-rn-ekspor/interface/InvoiceEksporRNInterfaces';
export const fetchGenCodeInvoice = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/invoice-ekspor`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posInvoiceEkspor = async (data: any) => {
  try {
    const result = await api.post(`/api/v1/marketing/invoice-ekspor`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateInvoice = async (id: string, data: any) => {
  try {
    const result = await api.patch(`/api/v1/marketing/invoice-ekspor/${id}`, data);
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
  status?: string | null;
  invoiceNumber: string | null;
  orderNumber: string | null;
  customerName: string | null;
}

export const fetchDataInvoice = async (params: ParamsType) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/marketing/invoice-ekspor?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataInvoiceById = async (
  id: string
): Promise<InvoiceEksporRNInterfaces.ResponseDataDetailType | undefined> => {
  try {
    const result = await api.get(`/api/v1/marketing/invoice-ekspor/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delInvoice = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/marketing/invoice/${id}`);
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
    const result = await axios(`/api/v1/master/satuan?${queryString}`);
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
