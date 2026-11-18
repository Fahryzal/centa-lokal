import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import { Dayjs } from 'dayjs';
import api from '@/api/axiosInstance';

export const fetchCashFLow = async (startDate: Dayjs, endDate: Dayjs, unitId: string) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const params = {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
    unitId,
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/keuangan/report/cash-flow?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchBalanceSheet = async (startDate: string, endDate: string, unitId: string) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const params = {
    startDate,
    endDate,
    unitId,
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/keuangan/report/balance-sheet?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchIncomeStatement = async (startDate: Dayjs, endDate: Dayjs, unitId: string) => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const params = {
    start: startDate.format('YYYY-MM-DD'),
    end: endDate.format('YYYY-MM-DD'),
    unitId,
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`/api/v1/keuangan/report/income-statement?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
