import { useQuery } from '@tanstack/react-query';
import * as ParamsInterfaces from '@/modules/dashboard/Components/WareHouse/Interfaces/ParamsInterfaces';
import { Data } from '@/modules/dashboard/Components/WareHouse/Interfaces/DateInterfaces';
import * as WareHouseAxios from '@/modules/dashboard/service/WareHouseAxios';
import * as DataProductInterfaces from '@/modules/dashboard/Components/WareHouse/Interfaces/DataProductInterfaces';
import * as DataProductIvent from '@/modules/dashboard/Components/WareHouse/Interfaces/DataProductIvent';

export function useWareHouse(params: ParamsInterfaces.ParamsType) {
  return useQuery<Data | undefined>({
    queryKey: ['warehouse-dashboard', params],
    queryFn: () => WareHouseAxios.fetchDataRawMaterial(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

export function useProduct(params: ParamsInterfaces.ParamsProductType) {
  return useQuery<DataProductInterfaces.Data | undefined>({
    queryKey: ['product-dashboard', params],
    queryFn: () => WareHouseAxios.fetchDataProduct(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

export function useInventoryProduct(params: ParamsInterfaces.ParamsProductIvenType) {
  return useQuery<DataProductIvent.Datum[] | undefined>({
    queryKey: ['ivent-dashboard', params],
    queryFn: () => WareHouseAxios.fetchIvenroduct(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}
