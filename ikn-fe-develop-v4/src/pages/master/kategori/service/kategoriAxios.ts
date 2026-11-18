import { KategoriType } from "@pages/master/kategori/interface/KatgoriInterfaces";
import { filterAndRemoveKeys, ThrowError } from "@/utils/helper";
import api from "@/api/axiosInstance";

export const fetchGenCodeKategori = async () => {
  try {
    const result = await api.get(
      `/api/v1/master/generate-code/kategori`
    );
    if (![200, 201].includes(result.status)) {
      throw Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e) {
   ThrowError(e)
  }
};


export const posKategori = async (data: KategoriType) => {
  try {
    const result = await api.post(
      `/api/v1/master/kategori`,
      data
    );
    if (![200, 201].includes(result.status)) {
      throw Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e);
  }
};

export const updateKategori = async (id: string, data: KategoriType) => {
  try {
    const result = await api.patch(
      `/api/v1/master/kategori/${id}`,
      data
    );
    if (![200, 201].includes(result.status)) {
      throw Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e) {
    ThrowError(e)
  }
};

interface ParamsType {
  page: number;
  limit: number;
  kode?: string | null;
  nama?: string | null;
}

export const fetchDataKategori = async (params: ParamsType) => {
  const removeKeys = ["data", "total"]; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(
      `/api/v1/master/kategori?${queryString}`
    );
    if (![200, 201].includes(result.status)) {
      throw Error("Terjadi kesalahan");
    }
    return result;
  } catch (e) {
   ThrowError(e)
  }
};

export const fetchDataKategoriById = async (id: string) => {
 
  try {
    const result = await api.get(
      `/api/v1/master/kategori/${id}`
    );
    if (![200, 201].includes(result.status)) {
      throw Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e) {
   ThrowError(e)
  }
};

export const delKategori = async (id: string) => {
  try {
    const result = await api.delete(
      `/api/v1/master/kategori/${id}`);
    if (![200, 201].includes(result.status)) {
      throw Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e) {
   ThrowError(e)
  }
};