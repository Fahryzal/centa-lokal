import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import {
  Data,
  InvoiceType,
  ParamsType,
  RaInvoiceByPurchaseOrderType,
} from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import {
  InvoiceDetailType,
  Data as DataDetail,
} from '@pages/marketing/invoice/interface/InvoiceDetailInterfaces';

export const createInvoice = async (data: {
  purchaseOrderId: string;
  spbIds: string[];
  invoiceNumber: string;
  invoiceDate: string;
  bankAccountId?: string;
  namaAtasan?: string;
  jabatanAtasan?: string;
}) => {
  try {
    const result = await api.post('/api/v1/marketing/invoice', data);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchInvoiceSpbItems = async (spbIds: string[]) => {
  const result = await api.post('/api/v1/marketing/invoice/spb-items', { spbIds });

  return result.data.data;
};

export const fetchNextRaInvoiceNumber = async () => {
  try {
    const result = await api.get('/api/v1/marketing/invoice/next-ra-number');

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchRaInvoiceByPurchaseOrder = async (
  purchaseOrderId: string
): Promise<RaInvoiceByPurchaseOrderType | null> => {
  try {
    const result = await api.get(
      `/api/v1/marketing/invoice/ra-by-purchase-order/${purchaseOrderId}`
    );

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
    return null;
  }
};

export const fetchDataInvoice = async (params: ParamsType): Promise<Data | undefined> => {
  const removeKeys = ['data', 'total', 'sortOrder', 'sortBy']; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get<InvoiceType>(`/api/v1/marketing/invoice?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataInvoiceById = async (id: string): Promise<DataDetail | undefined> => {
  try {
    const result = await api.get<InvoiceDetailType>(`/api/v1/marketing/invoice/${id}`);
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

export const updateInvoice = async (
  id: string,
  data: {
    invoiceNumber: string;
    invoiceDate: string;
    bankAccountId?: string;
    namaAtasan?: string;
    jabatanAtasan?: string;
  }
) => {
  try {
    const result = await api.patch(`/api/v1/marketing/invoice/${id}`, data);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const dropInvoice = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/marketing/invoice/${id}/drop`);

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
