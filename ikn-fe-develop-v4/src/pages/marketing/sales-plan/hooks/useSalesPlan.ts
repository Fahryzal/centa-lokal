// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as SalesPlanAxios from '@pages/marketing/sales-plan/service/SalesPlanAxios';
import * as SalePlanInterfaces from '@pages/marketing/sales-plan/interface/SalePlanInterfaces';
// GET
export function useSalesPlan(params: SalePlanInterfaces.ParamsType) {
  return useQuery<SalePlanInterfaces.Data | undefined>({
    queryKey: ['sales-plan', params],
    queryFn: () => SalesPlanAxios.fetchDataSalesPlan(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

//POST
export function useCreateSalesPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SalesPlanAxios.posSalesPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-plan'] });
    },
  });
}

// PUT
export function useUpdateSalesPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SalePlanInterfaces.SalesPlanPayloadType;
    }) => SalesPlanAxios.updateSalesPlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-plan'] });
    },
  });
}

// DELETE
export function useDeleSlePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SalesPlanAxios.delSalesPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-plan'] });
    },
  });
}

export function useSalesPlanByid(id: string) {
  return useQuery<SalePlanInterfaces.DataSalesPlanOne | undefined>({
    queryKey: ['sales-plan', id],
    queryFn: () => SalesPlanAxios.fetchDataSalesPlanById(id),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}
