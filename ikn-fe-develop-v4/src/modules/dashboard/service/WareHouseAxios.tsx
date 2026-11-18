import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as ParamsInterfaces from '@/modules/dashboard/Components/WareHouse/Interfaces/ParamsInterfaces';
import { Data } from '@/modules/dashboard/Components/WareHouse/Interfaces/DateInterfaces';
import * as DataProductInterfaces from '@/modules/dashboard/Components/WareHouse/Interfaces/DataProductInterfaces';
import * as DataProductIvent from '@/modules/dashboard/Components/WareHouse/Interfaces/DataProductIvent';

export const fetchDataRawMaterial = async (
  params: ParamsInterfaces.ParamsType
): Promise<Data | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/master/barang-mentah?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchAllDataRawMaterial = async (
  params: ParamsInterfaces.ParamsType
): Promise<any[]> => {
  const pageSize = 100;
  let page = 1;
  let totalData = 0;
  const allData: any[] = [];

  do {
    const requestParams = {
      ...params,
      page,
      limit: pageSize,
    };

    const removeKeys = ['data', 'total'];
    const fixObjParams = filterAndRemoveKeys(requestParams, removeKeys);
    const queryString = new URLSearchParams(fixObjParams as any).toString();

    const result = await api.get(`/api/v1/master/barang-mentah?${queryString}`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Gagal mengambil seluruh data Barang Mentah');
    }

    const responseData = result.data.data;
    const currentPageData = responseData?.data ?? [];

    allData.push(...currentPageData);
    totalData = Number(responseData?.totalData ?? allData.length);

    page++;

    if (currentPageData.length === 0) {
      break;
    }
  } while (allData.length < totalData);

  return allData;
};

export const fetchDataProduct = async (
  params: ParamsInterfaces.ParamsProductType
): Promise<DataProductInterfaces.Data | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/marketing/sale?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchAllDataProduct = async (
  params: ParamsInterfaces.ParamsProductType
): Promise<DataProductInterfaces.Datum[]> => {
  const pageSize = 100;
  let page = 1;
  let totalData = 0;

  const allData: DataProductInterfaces.Datum[] = [];

  do {
    const requestParams = {
      ...params,
      page,
      limit: pageSize,
    };

    const removeKeys = ['data', 'total'];
    const fixObjParams = filterAndRemoveKeys(requestParams, removeKeys);
    const queryString = new URLSearchParams(fixObjParams as any).toString();

    const result = await api.get(`/api/v1/marketing/sale?${queryString}`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Gagal mengambil seluruh data Barang Jadi');
    }

    const responseData = result.data.data;
    const currentPageData: DataProductInterfaces.Datum[] = responseData?.data ?? [];

    allData.push(...currentPageData);

    totalData = Number(responseData?.totalData ?? allData.length);

    if (currentPageData.length === 0) {
      break;
    }

    page++;
  } while (allData.length < totalData);

  return allData;
};

export const fetchIvenroduct = async (
  params: ParamsInterfaces.ParamsProductIvenType
): Promise<DataProductIvent.Datum[] | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/dashboard/warehouse/inventory?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
