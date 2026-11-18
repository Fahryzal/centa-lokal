import api from '@/api/axiosInstance';
import * as LoginInterFaces from '@/modules/authentication/interfaces/LoginInterFaces';
import { ThrowError } from '@/utils/helper';

export const posLogin = async (data: LoginInterFaces.PayloadLoginInterfaces) => {
  try {
    const result = await api.post(`/api/v1/authentikasi/login`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    const errorMessage = e.response?.data?.message || 'Gagal login.';
    ThrowError(errorMessage);
  }
};
