import { useQuery } from '@tanstack/react-query';
import * as DashboardService from '../service/DashboardService';
import {
  MarketingSummaryData,
  AkuntansiSummaryData,
  WarehouseSummaryData,
} from '../interfaces/DashboardInterfaces';

export function useMarketingSummary(period?: { start?: string; end?: string }) {
  return useQuery<MarketingSummaryData | undefined>({
    queryKey: ['dashboard', 'marketing', 'summary', period],
    queryFn: () => DashboardService.fetchMarketingSummary(period),
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useAkuntansiSummary(period?: { start?: string; end?: string }) {
  return useQuery<AkuntansiSummaryData | undefined>({
    queryKey: ['dashboard', 'akuntansi', 'summary', period],
    queryFn: () => DashboardService.fetchAkuntansiSummary(period),
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useWarehouseSummary(period?: { start?: string; end?: string }) {
  return useQuery<WarehouseSummaryData | undefined>({
    queryKey: ['dashboard', 'warehouse', 'summary', period],
    queryFn: () => DashboardService.fetchWarehouseSummary(period),
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
