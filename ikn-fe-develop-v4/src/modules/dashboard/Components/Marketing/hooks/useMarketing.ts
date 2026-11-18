// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { ParamsTypeBuyer } from '@/modules/dashboard/Components/Marketing/interfaces/Inetrfaces';
import * as MarektingAxios from '@/modules/dashboard/service/MarektingAxios';
import * as BuyerInterfaces from '@/modules/dashboard/Components/Marketing/interfaces/BuyerInterfaces';
// GET
export function useBuyer(params: ParamsTypeBuyer) {
  return useQuery<BuyerInterfaces.Datum[] | undefined>({
    queryKey: ['buyer-dashboard', params],
    queryFn: () => MarektingAxios.fetchDataBuyer(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}
