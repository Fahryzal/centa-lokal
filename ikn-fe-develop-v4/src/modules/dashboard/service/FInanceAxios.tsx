import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as Inetrfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/Inetrfaces';
import * as CashFlowInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/CashFlowInterfaces';
import * as NetProfitInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/NetProfitInterfaces';
import * as ExpanseInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/ExpanseInterfaces';
import * as BankBalanceInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/BankBalanceInterfaces';

export const fetchDataIncomeExpense = async (
  params: Inetrfaces.ParamsType
): Promise<Inetrfaces.DataExpenseIncome | any> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`api/v1/dashboard/akuntansi/income-expense?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataCashFLow = async (
  params: Inetrfaces.ParamsType
): Promise<CashFlowInterfaces.CashFlowType | any> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`api/v1/dashboard/akuntansi/cash-flow?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataNetProfit = async (
  params: Inetrfaces.ParamsType
): Promise<NetProfitInterfaces.NetProfitType | any> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`api/v1/dashboard/akuntansi/net-profit?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataExpanse = async (
  params: Inetrfaces.ParamsType
): Promise<ExpanseInterfaces.Datum | any> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`api/v1/dashboard/akuntansi/expense-summary?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataSaldoBank = async (
  params: Inetrfaces.ParamsType
): Promise<BankBalanceInterfaces.Datum[] | any> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(`api/v1/dashboard/akuntansi/bank-balance?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
