import { ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as interfacesGlobal from '@/utils/interfaces/interfacesGlobal';
import * as JurnalUmumInterfaces from '@pages/keuangan/jurnal/jurnal-umum/interfaces/JurnalUmumInterfaces';

export const fetchGenCodeJurnal = async (): Promise<JurnalUmumInterfaces.GenerateCodeResponse> => {
  try {
    const result = await api.get<
      interfacesGlobal.ApiResponse<JurnalUmumInterfaces.GenerateCodeResponse>
    >(`/api/v1/master/generate-code/number-jurnal`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};

export const posJurnal = async (payload: JurnalUmumInterfaces.JurnalUmumInterface) => {
  try {
    const result = await api.post(`/api/v1/keuangan/jurnal-entry`, payload);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};

export const posRevertJurnal = async (idJurnal: string, payload: any) => {
  try {
    const result = await api.post(`/api/v1/akuntansi/post-jurnal/${idJurnal}/revert`, payload);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};

export const delJournalEAntry = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/keuangan/jurnal-entry/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result;
  } catch (e: unknown) {
    ThrowError(e);
    throw e; // biar tetap lempar error kalau ada yang nangkap di luar
  }
};
