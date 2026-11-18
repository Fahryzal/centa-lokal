import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import * as SalePlanInterfaces from '@pages/marketing/sales-plan/interface/SalePlanInterfaces';

export const posSalesPlan = async (data: SalePlanInterfaces.SalesPlanPayloadType) => {
  try {
    const result = await api.post(`/api/v1/marketing/sales-plan`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateSalesPlan = async (
  id: string,
  data: SalePlanInterfaces.SalesPlanPayloadType
) => {
  try {
    const result = await api.patch(`/api/v1/marketing/sales-plan/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataSalesPlan = async (
  params: SalePlanInterfaces.ParamsType
): Promise<SalePlanInterfaces.Data | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get<SalePlanInterfaces.DataSalesPlanType>(
      `/api/v1/marketing/sales-plan?${queryString}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataSalesPlanById = async (
  id: string
): Promise<SalePlanInterfaces.DataSalesPlanOne | undefined> => {
  try {
    const result = await api.get(`/api/v1/marketing/sales-plan/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delSalesPlan = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/marketing/sales-plan/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataUnit = async (params: SalePlanInterfaces.ParamsType) => {
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
