import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as MasterAkunBankInterfaces from '@pages/master/master-akun-bank/interface/MasterAkunBankInterfaces';

export const fetchGenCodeAkunBank = async (
  query: MasterAkunBankInterfaces.ParamsBankAccountTypeGenCode
) => {
  const queryString = new URLSearchParams(query as any).toString();
  try {
    const result = await api.get(`/api/v1/keuangan/bank-account/number?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchGenCodeAkunBankPay = async (
  query: MasterAkunBankInterfaces.ParamsBankAccountTypeGenCode
) => {
  const queryString = new URLSearchParams(query as any).toString();
  try {
    const result = await api.get(`/api/v1/keuangan/bank-account/number-pembayaran?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posAkunBank = async (data: MasterAkunBankInterfaces.PayloadType) => {
  try {
    const result = await api.post(`/api/v1/keuangan/bank-account`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateAkunBank = async (id: string, data: MasterAkunBankInterfaces.PayloadType) => {
  try {
    const result = await api.patch(`/api/v1/keuangan/bank-account/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataAkunBank = async (
  params: MasterAkunBankInterfaces.ParamsBankAccountType
): Promise<MasterAkunBankInterfaces.Data | undefined> => {
  const removeKeys = ['data', 'total', 'sortOrder']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get<MasterAkunBankInterfaces.DataAllAccoutBankType>(
      `/api/v1/keuangan/bank-account?${queryString}`
    );
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataAkunBankById = async (
  id: string
): Promise<MasterAkunBankInterfaces.DataDetail | undefined> => {
  try {
    const result = await api.get<MasterAkunBankInterfaces.AccountBankDetailType>(
      `/api/v1/keuangan/bank-account/${id}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delAkunBank = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/keuangan/bank-account/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const revertAkunBank = async (id: string) => {
  try {
    const result = await api.patch(`/api/v1/keuangan/bank-account/revert/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const postingAkunBank = async (id: string) => {
  try {
    const result = await api.patch(`/api/v1/keuangan/bank-account/posting/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
