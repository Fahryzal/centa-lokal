// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import * as Inetrfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/Inetrfaces';
import * as FInanceAxios from '@/modules/dashboard/service/FInanceAxios';
import * as CashFlowInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/CashFlowInterfaces';
import * as NetProfitInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/NetProfitInterfaces';
import * as ExpanseInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/ExpanseInterfaces';
import * as BankBalanceInterfaces from '@/modules/dashboard/Components/FinanceAkuntansi/interfaces/BankBalanceInterfaces';

// GET
export function useIncomeExpense(params: Inetrfaces.ParamsType) {
  return useQuery<Inetrfaces.DataExpenseIncome[] | undefined>({
    queryKey: ['akuntansi-dashboard', params],
    queryFn: () => FInanceAxios.fetchDataIncomeExpense(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

export function useCashFLow(params: Inetrfaces.ParamsType) {
  return useQuery<CashFlowInterfaces.CashFlowType[] | undefined>({
    queryKey: ['cashflow-dashboard', params],
    queryFn: () => FInanceAxios.fetchDataCashFLow(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

export function useNetProfit(params: Inetrfaces.ParamsType) {
  return useQuery<NetProfitInterfaces.NetProfitType[] | undefined>({
    queryKey: ['net-profit-dashboard', params],
    queryFn: () => FInanceAxios.fetchDataNetProfit(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

export function useExpanse(params: Inetrfaces.ParamsType) {
  return useQuery<ExpanseInterfaces.Datum[] | undefined>({
    queryKey: ['expanse-dashboard', params],
    queryFn: () => FInanceAxios.fetchDataExpanse(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

export function useBankBalance(params: Inetrfaces.ParamsType) {
  return useQuery<BankBalanceInterfaces.Datum[] | undefined>({
    queryKey: ['bank-balance-dashboard', params],
    queryFn: () => FInanceAxios.fetchDataSaldoBank(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}
