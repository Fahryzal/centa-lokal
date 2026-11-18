import { DataType } from '@/pages/gudang/barang-mentah/interface/BarangMentahInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';

/**
 * Tipe payload untuk memperbarui pengeluaran barang mentah.
 * Dipisahkan dari DataType karena DataType digunakan untuk data hasil pengambilan.
 */
export interface UpdateBarangMentahIssuePayload {
  documentCode: string;
  documentNo: string;
  date: string;
  keterangan: string;
  diPergunakan: string;
  items: {
    masterRawMaterialId: string;
    quantity: number;
    Satuan: string;
    nilaiSatuan: number;
    accountCode: string;
    accountName: string;
  }[];
}

export const fetchGenCodeBarangMentahIssue = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/barang-jadi`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat membuat kode dokumen');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posBarangMentahIssue = async (data: DataType) => {
  try {
    const result = await api.post(`/api/v1/gudang/barang-mentah/pengeluaran`, data);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat menyimpan pengeluaran');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateBarangMentahIssue = async (id: string, data: UpdateBarangMentahIssuePayload) => {
  try {
    const result = await api.patch(`/api/v1/gudang/barang-mentah/issue/${id}`, data);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat memperbarui pengeluaran');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

interface ParamsType {
  page: number;
  limit: number;
  date?: string | null;
  description?: string | null;
  unit?: string | null;
  periode_month?: string | null;
  status?: string | null;
  value_rkap?: string | null;
  documentCode?: string | null;
  documentNumber?: string | null;
  data?: unknown;
  total?: number;
  loading?: boolean;
}

export const fetchDataBarangMentahIssue = async (params: ParamsType) => {
  const removeKeys = ['data', 'total', 'loading'];

  const normalizedParams = {
    ...params,
    date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
  };

  const fixObjParams = filterAndRemoveKeys(normalizedParams, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();

  try {
    const result = await api.get(`/api/v1/gudang/barang-mentah/issue?${queryString}`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil daftar pengeluaran');
    }

    return result;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataBarangMentahIssueById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/gudang/barang-mentah/issue/${id}`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil detail pengeluaran');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const postBarangMentahIssue = async (id: string) => {
  try {
    const result = await api.post(`/api/v1/gudang/barang-mentah/issue/${id}/post`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat posting jurnal pengeluaran');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const revertBarangMentahIssue = async (id: string) => {
  try {
    const result = await api.post(`/api/v1/gudang/barang-mentah/issue/${id}/revert`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat revert pengeluaran');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const delBarangMentahIssue = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/gudang/barang-mentah/issue/${id}`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat menghapus pengeluaran');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchGenCodeBarangMentahWithStock = async () => {
  try {
    const result = await api.get(`/api/v1/master/barang-mentah/all`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil master barang mentah');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchfindOneStockSummaryById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/gudang/barang-mentah/stock-summary/${id}`);

    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil ringkasan stok');
    }

    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
