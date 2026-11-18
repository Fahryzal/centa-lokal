import { ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
export const fetchDataBukuBesar = async (
  accountCode: string,
  startDate: string,
  endDate: string,
  unitId: string
) => {
  try {
    const params = {
      accountCode,
      startDate,
      endDate,
      unitId,
    };
    const queryString = new URLSearchParams(params as any).toString();

    const result = await api.get(`api/v1/akuntansi/post-jurnal/buku-besar?${queryString}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
