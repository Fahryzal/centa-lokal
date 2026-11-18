import { TransactionType } from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';
import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import dayjs from 'dayjs';
import api from '@/api/axiosInstance';
import * as BarangJadiInterfaces from '@/pages/gudang/barang-jadi/interface/BarangJadiInterfaces';

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
// GENERATE CODE
// =====================================================

export const fetchGenCodeBarangJadi = async () => {
  try {
    const result = await api.get('/api/v1/master/generate-code/barang-jadi');

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat membuat kode barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

export const fetchGenCodePo = async () => {
  try {
    const result = await api.get('/api/v1/master/generate-code/po');

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat membuat kode PO.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// BARANG JADI: CREATE
// Endpoint lama dipertahankan.
// =====================================================

export const posBarangJadi = async (data: BarangJadiInterfaces.PayloadBarangJadiType) => {
  try {
    const result = await api.post('/api/v1/gudang/product', data);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat menambahkan barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// UPDATE ORDER PO PRA
// Fungsi lama dipertahankan.
// =====================================================

export const updateBarangjadi = async (id: string, data: TransactionType) => {
  try {
    const result = await api.patch(`/api/v1/marketing/order-po-pra/${id}`, data);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat memperbarui Order PO PRA.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// BARANG JADI: UPDATE ENDPOINT LAMA
// Tetap dipertahankan agar pemanggil lama tidak rusak.
// =====================================================

export const updateDataBarangJadi = async (
  id: string,
  data: BarangJadiInterfaces.PayloadBarangJadiType
) => {
  try {
    const result = await api.patch(`/api/v1/gudang/product/${id}`, data);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat memperbarui barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// BARANG JADI: LIST
// =====================================================

export const fetchDataBarangJadi = async (params: BarangJadiInterfaces.BarangJadiParams) => {
  try {
    const normalizedParams = {
      ...params,
      date: params.date ? dayjs(params.date).format('YYYY-MM-DD') : '',
    };

    const queryString = buildQueryString(normalizedParams as unknown as Record<string, unknown>);

    const result = await api.get(`/api/v1/gudang/product${queryString ? `?${queryString}` : ''}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data barang jadi.');
    }

    return result;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// BARANG JADI: DETAIL
// Endpoint lama tetap dipertahankan.
// =====================================================

export const fetchDataBarangById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/gudang/product/${id}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil detail barang jadi.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// BARANG JADI: DELETE ENDPOINT LAMA
// Tetap dipertahankan.
// =====================================================

export const delBarangJadi = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/marketing/order-po-pra/${id}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat menghapus data.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// MASTER UNIT
// =====================================================

export const fetchDataUnit = async (params: BarangJadiInterfaces.BarangJadiParams) => {
  try {
    const queryString = buildQueryString(params as unknown as Record<string, unknown>);

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
// MASTER SATUAN
// =====================================================

export const fetchDataSatuan = async (params: BarangJadiInterfaces.BarangJadiParams) => {
  try {
    const queryString = buildQueryString(params as unknown as Record<string, unknown>);

    const result = await api.get(`/api/v1/master/satuan${queryString ? `?${queryString}` : ''}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data satuan.');
    }

    return result;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// MASTER CUSTOMER
// =====================================================

export const fetchDataCustomer = async (params: BarangJadiInterfaces.BarangJadiParams) => {
  try {
    const queryString = buildQueryString(params as unknown as Record<string, unknown>);

    const result = await api.get(`/api/v1/master/customer${queryString ? `?${queryString}` : ''}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil data customer.');
    }

    return result;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// MASTER BARANG JADI DENGAN STOK
// =====================================================

export const fetchGenCodeBarangJadiWithStock = async (params?: Record<string, any>) => {
  try {
    const queryString = buildQueryString(params ?? {});

    const result = await api.get(
      `/api/v1/master/barang-jadi/all${queryString ? `?${queryString}` : ''}`
    );

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil barang jadi dengan stok.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

export const fetchGenCodeBarangJadiWithStockParams = async (
  params: BarangJadiInterfaces.BarangJadiStockParams
) => {
  try {
    // Parameter tetap dikirim agar filter yang diberikan pemanggil tidak hilang.
    const queryString = buildQueryString(params as unknown as Record<string, unknown>);

    const result = await api.get(
      `/api/v1/master/barang-jadi/all${queryString ? `?${queryString}` : ''}`
    );

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil barang jadi dengan stok.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// KARTU GUDANG
// =====================================================

export const fetchKartuGudang = async (id: string, params: Record<string, any>) => {
  try {
    const queryString = buildQueryString(params, ['data', 'total', 'dataSource']);

    const result = await api.get(
      `/api/v1/gudang/product/product-card-ware-house/${id}${queryString ? `?${queryString}` : ''}`
    );

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil kartu gudang.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENERIMAAN BARANG: LIST
// Endpoint berdasarkan InventorisController.
// =====================================================

export const fetchDataPenerimaanBarang = async (
  params: BarangJadiInterfaces.PenerimaanBarangParams
) => {
  try {
    const result = await api.get('/api/v1/inventoris', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 5,
        date: params.date || undefined,
        documentCode: params.documentCode || undefined,
        documentNumber: params.documentNumber || undefined,
        unit: params.unit || undefined,

        // Controller yang dikirim belum memfilter status.
        // Parameter ini tidak dikirim agar tidak menganggap backend
        // sudah mendukung filter status.
      },
    });

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil daftar penerimaan.');
    }

    return result.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENERIMAAN BARANG: DETAIL
// GET /api/v1/inventoris/:id
// =====================================================

export const fetchPenerimaanBarangById = async (id: string) => {
  try {
    const result = await api.get(`/api/v1/inventoris/${id}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat mengambil detail penerimaan.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENERIMAAN BARANG: CREATE
// POST /api/v1/inventoris
// =====================================================

export const createPenerimaanBarang = async (
  data: BarangJadiInterfaces.PenerimaanBarangPayload
) => {
  try {
    const result = await api.post('/api/v1/inventoris', data);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat membuat penerimaan barang.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENERIMAAN BARANG: UPDATE DRAFT
// PATCH /api/v1/inventoris/:id
// =====================================================

export const updatePenerimaanBarang = async (
  id: string,
  data: BarangJadiInterfaces.PenerimaanBarangPayload
) => {
  try {
    const result = await api.patch(`/api/v1/inventoris/${id}`, data);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat memperbarui penerimaan barang.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENERIMAAN BARANG: POSTING
// POST /api/v1/inventoris/:id/post
// =====================================================

export const postPenerimaanBarang = async (id: string) => {
  try {
    const result = await api.post(`/api/v1/gudang/product/${id}/post`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat posting penerimaan barang.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENERIMAAN BARANG: REVERT
// POST /api/v1/inventoris/:id/revert
// =====================================================

export const revertPenerimaanBarang = async (id: string) => {
  try {
    const result = await api.post(`/api/v1/gudang/product/${id}/revert`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat revert penerimaan barang.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};

// =====================================================
// PENERIMAAN BARANG: DELETE
// DELETE /api/v1/inventoris/:id
// =====================================================

export const deletePenerimaanBarang = async (id: string) => {
  try {
    const result = await api.delete(`/api/v1/gudang/product/${id}`);

    if (!isSuccessStatus(result.status)) {
      throw new Error('Terjadi kesalahan saat menghapus penerimaan barang.');
    }

    return result.data.data;
  } catch (error: any) {
    ThrowError(error);
    throw error;
  }
};
