import api from '@/api/axiosInstance';
import { ThrowError } from '@/utils/helper';
import {
  MarketingSummaryResponse,
  AkuntansiSummaryResponse,
  WarehouseSummaryResponse,
  MarketingSummaryData,
  AkuntansiSummaryData,
  WarehouseSummaryData,
} from '../interfaces/DashboardInterfaces';

export const fetchMarketingSummary = async (period?: {
  start?: string;
  end?: string;
}): Promise<MarketingSummaryData | undefined> => {
  try {
    const params = period?.start ? { period: `${period.start}-${period.end}` } : {};
    const result = await api.get<MarketingSummaryResponse>('/api/v1/dashboard/marketing/summary', {
      params,
    });
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data marketing summary');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchAkuntansiSummary = async (period?: {
  start?: string;
  end?: string;
}): Promise<AkuntansiSummaryData | undefined> => {
  try {
    const params = period?.start ? { period: `${period.start}-${period.end}` } : {};
    const result = await api.get<AkuntansiSummaryResponse>('/api/v1/dashboard/akuntansi/summary', {
      params,
    });
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data akuntansi summary');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchWarehouseSummary = async (period?: {
  start?: string;
  end?: string;
}): Promise<WarehouseSummaryData | undefined> => {
  try {
    const params = period?.start ? { period: `${period.start}-${period.end}` } : {};
    const result = await api.get<WarehouseSummaryResponse>('/api/v1/dashboard/warehouse/summary', {
      params,
    });
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data warehouse summary');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
