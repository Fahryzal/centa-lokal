import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import * as JurnalHeaderInterfaces from '@pages/keuangan/jurnal/jurnal-khusus/interface/JurnalHeaderInterfaces';
export const fetchJurnalKhusus = async (params: any) => {
  const removeKeys = ['data', 'total'];
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/keuangan/jurnal-entry?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchJurnalKhususDetail = async (
  id: string
): Promise<JurnalHeaderInterfaces.JurnalHeaderInterface | undefined> => {
  try {
    const result = await api.get(`/api/v1/keuangan/jurnal-entry/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateJurnalKhusus = async (id: string, data: JurnalHeaderInterfaces.Payload[]) => {
  try {
    const result = await api.patch(`/api/v1/keuangan/jurnal-entry/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchJurnalKhususHeader = async (params: any) => {
  try {
    const removeKeys = ['data', 'total', 'postCount', 'loading'];
    params = {
      ...params,
      date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
      periode: params.periode ? dayjs(params.periode).format('YYYY-MM-DD') : '',
    };
    const fixObjParams = filterAndRemoveKeys(params, removeKeys);
    const queryString = new URLSearchParams(fixObjParams as any).toString();
    const result = await api.get(`/api/v1/keuangan/jurnal-entry/header?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posPostingJurnal = async (idJurnal: string) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/post-jurnal/${idJurnal}/post`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};
