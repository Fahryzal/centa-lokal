import { ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import qs from 'qs'; // pastikan sudah install: npm i qs

export const fetchDataBalanceSheet = async () => {
  try {
    const result = await api.get(`/api/v1/keuangan/report-general-edger/by-unit?period=2025-07`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataTrialBalance = async (unitId: string[], periode: string) => {
  try {
    const unitIds = unitId.map((u: any) => u.id);
    const query = qs.stringify(
      { unitId: unitIds, period: periode },
      { arrayFormat: 'repeat' } // 👈 menghasilkan ?unitId=U001&unitId=U002
    );
    const result = await api.get(`/api/v1/keuangan/report-general-edger/trial-balance?${query}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataMaxPeriode = async (unitId: string[]) => {
  try {
    const unitIds = unitId.map((u: any) => u.id);
    const query = qs.stringify(
      { unitId: unitIds },
      { arrayFormat: 'repeat' } // 👈 menghasilkan ?unitId=U001&unitId=U002
    );
    const result = await api.get(`/api/v1/keuangan/report-general-edger/max-periode?${query}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
