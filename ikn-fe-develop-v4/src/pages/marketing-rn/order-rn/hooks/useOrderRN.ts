// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as OrderRNInterfacesGet from '@/pages/marketing-rn/order-rn/interface/OrderRNInterfacesGet';
import * as OrderRNAxios from '@pages/marketing-rn/order-rn/service/OrderRNAxios';
import * as OrderRNInterfaces from '@/pages/marketing-rn/order-rn/interface/OrderRNInterfaces';
const depedensi = 'order-rn';
// GET
export function useOrderRN(params: OrderRNInterfaces.ParamsType) {
  return useQuery<OrderRNInterfacesGet.DataOrderRN | undefined>({
    queryKey: [depedensi, params],
    queryFn: () => OrderRNAxios.fetchDataOrderPrn(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

//POST
// export function useCreateSalesPlan() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: SalesPlanAxios.posSalesPlan,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['sales-plan'] });
//     },
//   });
// }

// // PUT
// export function useUpdateSalesPlan() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: SalePlanInterfaces.SalesPlanPayloadType;
//     }) => SalesPlanAxios.updateSalesPlan(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['sales-plan'] });
//     },
//   });
// }

// DELETE
export function useDelOrderRN() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OrderRNAxios.delOrderPra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [depedensi] });
    },
  });
}
