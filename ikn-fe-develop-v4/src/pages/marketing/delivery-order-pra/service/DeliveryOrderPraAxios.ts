import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import * as DeliveryOrderPraInterfaces from '@pages/marketing/delivery-order-pra/interface/DeliveryOrderPraInterfaces';

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

export const posDeliveryOrderPra = async (data: DeliveryOrderPraInterfaces.PayloadDORA) => {
  try {
    const result = await api.post(`/api/v1/marketing/order-delevery-pra`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateDeliveryOrderPra = async (
  id: string,
  data: DeliveryOrderPraInterfaces.UpdateDeliveryOrderPraPayload
) => {
  try {
    const result = await api.patch(`/api/v1/marketing/order-delevery-pra/${id}`, data);

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
  typeSalesDelivery?: string | null;
  status?: string | null;
  description?: string | null;
}

export const fetchDataDeliveryOrderPra = async (params: ParamsType) => {
  const removeKeys = ['data', 'total', 'sortOrder']; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/marketing/order-delevery-pra?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataDeliveryOrderPraById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/marketing/order-delevery-pra/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delDeliveryOrderPra = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/marketing/order-delevery-pra/${id}`);
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

export const fetchHistoryDeliveryOrderPra = async (purchaseOrderId: string) => {
  try {
    const result = await api.get(
      `/api/v1/marketing/order-delevery-pra/history/${purchaseOrderId}`,
    );

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
