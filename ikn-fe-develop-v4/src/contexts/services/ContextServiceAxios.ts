import { ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';

export const fetchLoginMe = async () => {
  try {
    const result = await api.get(`/api/v1/authentikasi/login/me`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
