import { SatuanType } from "@/pages/master/satuan/interface/SatuanInterfaces";
import { filterAndRemoveKeys, ThrowError } from "@/utils/helper";
import api from "@/api/axiosInstance";

export const fetchGenCodeSatuan = async () => {
  try {
    const result = await api.get(`/api/v1/master/generate-code/satuan`);
    if (![200, 201].includes(result.status)) {
      throw new Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posSatuan = async (data: SatuanType) => {
  try {
    const result = await api.post(
      `/api/v1/master/satuan`,
      data
    );
    if (![200, 201].includes(result.status)) {
      throw new Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e: any) {
   ThrowError(e)
  }
};

export const updateSatuan = async (id: string, data: SatuanType) => {
  try {
    const result = await api.patch(
      `/api/v1/master/satuan/${id}`,
      data
    );
    if (![200, 201].includes(result.status)) {
      throw new Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e: any) {
   ThrowError(e)
  }
};

interface ParamsType {
  page: number;
  limit: number;
  kode?: string | null;
  keterangan?: string | null;
}

export const fetchDataSatuan = async (params: ParamsType) => {
  const removeKeys = ["data", "total"]; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    return await api.get(
      `/api/v1/master/satuan?${queryString}`
    );
  } catch (e: any) {
   ThrowError(e)
  }
};

export const fetchDataSatuanById = async (id: string) => {
  try {
    const result = await api.get(
      `/api/v1/master/satuan/${id}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e)
  }
};

export const delSatuan = async (id: string) => {
  try {
    const result = await api.delete(
      `/api/v1/master/satuan/${id}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error("Terjadi kesalahan");
    }
    return result.data.data;
  } catch (e: any) {
   ThrowError(e)
  }
};
