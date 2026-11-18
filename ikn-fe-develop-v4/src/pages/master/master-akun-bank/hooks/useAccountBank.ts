// // src/hooks/useUsers.ts
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import * as MasterAkunBankAxios from '@pages/master/master-akun-bank/service/MasterAkunBankAxios';
// import * as MasterAkunBankInterfaces from '@pages/master/master-akun-bank/interface/MasterAkunBankInterfaces';
// const depedensi = 'master-account-bank';
// // GET
// export function useAccountBank(params: MasterAkunBankInterfaces.ParamsBankAccountType) {
//   return useQuery<MasterAkunBankInterfaces.DataBankAccountType | undefined>({
//     queryKey: [depedensi, params],
//     queryFn: () => MasterAkunBankAxios.fetchDataAkunBank(params),
//     placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
//     retry: 1,
//     refetchOnMount: true, // ✅ refetch ketika mount lagi
//     refetchOnWindowFocus: false,
//   });
// }

// //POST
// export function useCreateAccountBank() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: SalesPlanAxios.posSalesPlan,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [depedensi] });
//     },
//   });
// }

// // PUT
// export function useUpdateAccountBank() {
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
//       queryClient.invalidateQueries({ queryKey: [depedensi] });
//     },
//   });
// }

// // // DELETE
// // export function useDeleteUser() {
// //   const queryClient = useQueryClient();
// //   return useMutation({
// //     mutationFn: deleteUser,
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['users'] });
// //     },
// //   });
// // }
