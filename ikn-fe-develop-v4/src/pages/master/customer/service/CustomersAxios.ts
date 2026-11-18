import * as CustomerInterfaces from '@/pages/master/customer/interface/CustomerInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';

export const fetchGenCodeCustomer = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/customer`);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

export const posCustomer = async (data: CustomerInterfaces.CusomersType) => {
  try {
    const result = await api.post(`/api/v1/master/customer`, data);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

export const updateCustomer = async (id: string, data: CustomerInterfaces.CusomersType) => {
  try {
    const result = await api.patch(`/api/v1/master/customer/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

export const fetchDataCustomer = async (
  params: CustomerInterfaces.ParamsType
): Promise<CustomerInterfaces.CusomersData | any> => {
  const removeKeys = ['data', 'total', 'sortOrder']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/master/customer?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result;
  } catch (e) {
    ThrowError(e);
  }
};

export const fetchDataCustomerById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/master/customer/${id}`);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

export const delCustomer = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/master/customer/${id}`);
    if (![200, 201].includes(result.status)) {
      throw Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};
