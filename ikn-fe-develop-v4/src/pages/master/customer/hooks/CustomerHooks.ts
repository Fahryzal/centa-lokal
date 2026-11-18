// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import * as CustomerInterfaces from '@/pages/master/customer/interface/CustomerInterfaces';
import * as CustomersAxios from '@pages/master/customer/service/CustomersAxios';

const depedensi = 'customer';
// GET
export function useCustomer(params: CustomerInterfaces.ParamsType) {
  return useQuery<CustomerInterfaces.CusomersData | undefined>({
    queryKey: [depedensi, params],
    queryFn: () => CustomersAxios.fetchDataCustomer(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}
