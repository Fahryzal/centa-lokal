import { ThrowError, filterAndRemoveKeys } from '@/utils/helper';
import api from '@/api/axiosInstance';

import * as FinishedGoodsIssueInterfaces from '@/pages/gudang/barang-jadi-issue/interface/BarangJadiIssueInterfaces';

// =====================================================
// HELPER
// =====================================================

const isSuccessStatus = (status: number) => [200, 201].includes(status);

const buildQueryString = (
  params: Record<string, unknown>,
  removeKeys: string[] = ['data', 'total']
) => {
  const filtered = filterAndRemoveKeys(params, removeKeys) as Record<string, unknown>;

  const query = new URLSearchParams();

  Object.entries(filtered ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (value instanceof Date) {
      query.set(key, value.toISOString());
    } else {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

// =====================================================
// MASTER UNIT
// Digunakan untuk pilihan unit pada form pengeluaran.
// =====================================================

export const fetchDataUnit = async (params: Record<string, unknown> = {}) => {
  try {
    const queryString = buildQueryString(params);

    const result = await api.get(`/api/v1/master/unit${queryString ? `?${queryString}` : ''}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data unit.');
    }

    return result;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// MASTER BARANG JADI
// Mengambil barang jadi beserta informasi stok.
// =====================================================

export const fetchBarangJadiForIssue = async (params: Record<string, unknown> = {}) => {
  try {
    const queryString = buildQueryString(params);

    const result = await api.get(
      `/api/v1/master/barang-jadi/all${queryString ? `?${queryString}` : ''}`
    );

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil master barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENGELUARAN BARANG JADI: CREATE
// POST /api/v1/finished-goods-issue
// =====================================================

export const createFinishedGoodsIssue = async (
  data: FinishedGoodsIssueInterfaces.FinishedGoodsIssuePayload
) => {
  try {
    const result = await api.post('/api/v1/finished-goods-issue', data);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat membuat pengeluaran barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENGELUARAN BARANG JADI: GET ALL
// GET /api/v1/finished-goods-issue
// =====================================================

export const fetchDataFinishedGoodsIssue = async (
  params: FinishedGoodsIssueInterfaces.FinishedGoodsIssueParams = {}
) => {
  try {
    const queryString = buildQueryString({ ...params });

    const result = await api.get(
      `/api/v1/finished-goods-issue${queryString ? `?${queryString}` : ''}`
    );

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data pengeluaran barang jadi.');
    }

    return result;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENGELUARAN BARANG JADI: GET BY ID
// GET /api/v1/finished-goods-issue/:id
// =====================================================
export const fetchDataFinishedGoodsIssueById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/finished-goods-issue/${id}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Gagal mengambil detail pengeluaran barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENGELUARAN BARANG JADI: POSTING
// POST /api/v1/finished-goods-issue/:id/post
// =====================================================
export const postFinishedGoodsIssue = async (id: string) => {
  try {
    const result = await api.post(`/api/v1/finished-goods-issue/${id}/post`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat posting pengeluaran barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENGELUARAN BARANG JADI: REVERT
// POST /api/v1/finished-goods-issue/:id/revert
// =====================================================

export const revertFinishedGoodsIssue = async (id: string) => {
  try {
    const result = await api.post(`/api/v1/finished-goods-issue/${id}/revert`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat revert pengeluaran barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENGELUARAN BARANG JADI: UPDATE
// PATCH /api/v1/finished-goods-issue/:id
// =====================================================

export const updateFinishedGoodsIssue = async (
  id: string,
  data: FinishedGoodsIssueInterfaces.UpdateFinishedGoodsIssuePayload
) => {
  try {
    const result = await api.patch(`/api/v1/finished-goods-issue/${id}`, data);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat memperbarui pengeluaran barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENGELUARAN BARANG JADI: DELETE
// DELETE /api/v1/finished-goods-issue/:id
// =====================================================

export const deleteFinishedGoodsIssue = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/finished-goods-issue/${id}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat menghapus pengeluaran barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};
