// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import * as BarangjadiInterfaces from '@/pages/master/barang-jadi/interface/BarangjadiInterfaces';
import * as BarangJadiAxios from '@pages/master/barang-jadi/service/BarangJadiAxios';

const depedensi = 'barang-jadi';
// GET
export function useBarangjadi(params: BarangjadiInterfaces.ParamsType) {
  return useQuery<BarangjadiInterfaces.DatBarangJadi | undefined>({
    queryKey: [depedensi, params],
    queryFn: () => BarangJadiAxios.fetchDataBarangjadi(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}
