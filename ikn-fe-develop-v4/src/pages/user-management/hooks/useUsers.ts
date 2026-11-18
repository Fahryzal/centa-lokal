// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import * as UserManagementAxios from '@pages/user-management/service/UserManagementAxios';
import { DataResultType, ParamsUserManagementType } from '../interface/UsermanagementInterfaces';
// useMutation, useQueryClient
// GET
export function useUsers(params: ParamsUserManagementType) {
  return useQuery<DataResultType | undefined>({
    queryKey: ['users', params],
    queryFn: () => UserManagementAxios.fetchDataUserManagement(params),
    placeholderData: (previousData) => previousData, // ✅ pengganti keepPreviousData
    staleTime: 1000 * 60 * 5, // optional: biar nggak refetch terus
    retry: 1, // optional: coba 1x lagi kalau error
  });
}

// POST
// export function useCreateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// }

// // PUT
// export function useUpdateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
//       updateUser(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// }

// // DELETE
// export function useDeleteUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });
// }
