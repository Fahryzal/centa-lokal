// src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import * as InvoiceAxios from '@pages/marketing/invoice/service/InvoiceAxios';

// GET
export function useInvoice(params: InvoiceInterfaces.ParamsType) {
  return useQuery<InvoiceInterfaces.Data | undefined>({
    queryKey: ['invoice', params],
    queryFn: () => InvoiceAxios.fetchDataInvoice(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    retry: 1,
    refetchOnMount: true, // ✅ refetch ketika mount lagi
    refetchOnWindowFocus: false,
  });
}

// DELETE
export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => InvoiceAxios.delInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
    },
  });
}

// Detail
export function useDetailInvoice(id?: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: ({ queryKey }) => {
      const [, invoiceId] = queryKey;
      return InvoiceAxios.fetchDataInvoiceById(invoiceId as string);
    },
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
