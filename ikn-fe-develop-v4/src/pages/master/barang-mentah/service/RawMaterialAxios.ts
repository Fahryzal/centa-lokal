import {
  GetDataMaterial,
  ParamsType,
  RawMaterial,
} from '@/pages/master/barang-mentah/interface/BarangjadiInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import { Datum } from '@ant-design/charts';

export const fetchGenCodeRawMaterial = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/raw-material`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataAccount = async (params: any) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus

  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/master/account?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posRawMaterial = async (data: RawMaterial) => {
  try {
    const result = await api.post(`/api/v1/master/barang-mentah`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateRawMaterial = async (id: string, data: RawMaterial) => {
  try {
    const result = await api.patch(`/api/v1/master/barang-mentah/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataRawMaterial = async (params: ParamsType): Promise<Datum | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get<GetDataMaterial>(`/api/v1/master/barang-mentah?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataRawmaterialById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/master/barang-mentah/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delRawMaterial = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/master/barang-mentah/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
