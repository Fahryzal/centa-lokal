import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as RoleAxios from '@pages/user-management/service/RoleAxios';
import * as RoleInterfaces from '@pages/user-management/interface/RoleInterfaces';
import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';

export function useRoles(params?: RoleInterfaces.DatumType) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => RoleAxios.fetchDataRole(params),
    placeholderData: (previousData) => previousData,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => RoleAxios.fetchDataRoleById(id),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleInterfaces.PayloadType) => RoleAxios.posRoles(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showNotification('success', 'Berhasil', 'Berhasil Menambahkan Data');
    },
    onError: (error) => {
      const message = handleMessageError(error, 'Gagal Menambahkan Data');
      showNotification('error', 'Gagal', message);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleInterfaces.PayloadType }) =>
      RoleAxios.updateRoles(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showNotification('success', 'Berhasil', 'Berhasil Mengubah Data');
    },
    onError: (error) => {
      const message = handleMessageError(error, 'Gagal Mengubah Data');
      showNotification('error', 'Gagal', message);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RoleAxios.delRoles(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showNotification('success', 'Berhasil', 'Berhasil Hapus Data');
    },
    onError: (error) => {
      const message = handleMessageError(error, 'Gagal Hapus Data');
      showNotification('error', 'Gagal', message);
    },
  });
}
