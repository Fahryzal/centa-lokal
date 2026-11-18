import { filterAndRemoveKeys, ThrowError } from "@/utils/helper";
import dayjs from "dayjs";
import api from "@/api/axiosInstance";

interface ParamsType {
  page: number;
  limit: number;
  date?: string | null;
  description?: string | null;
  status?: string | null;
  typeSalesSPb: string
}

export const fetchDataSalesReport = async (params: ParamsType) => {
  const removeKeys = ["data", "total"]; // Properti yang ingin dihapus
  params = {
    ...params,
    date: params.date ? dayjs(params.date).format("YYYY-MM-DD") : "",
  };
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get(
      `/api/v1/marketing/report/laporan-penjualan?${queryString}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error("Terjadi kesalahan");
    }
    return result
  } catch (e: any) {
   ThrowError(e)
  }
};