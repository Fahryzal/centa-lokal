import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as MenuAxios from '@pages/user-management/service/MenuAxios';
import * as MenuInterfaces from 'pages/user-management/interface/MenuInterfaces';

// GET Menus
export function useMenus(params: MenuInterfaces.DatumType) {
  return useQuery<MenuInterfaces.DataType | undefined>({
    queryKey: ['menus', params],
    queryFn: () => MenuAxios.fetchDataMenus(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

// GET Menu By ID
export function useMenuById(id: string) {
  return useQuery({
    queryKey: ['menu', id],
    queryFn: () => MenuAxios.fetchDataMenuById(id),
    enabled: !!id,
  });
}

// GET Menus By Group
export function useMenusByGroup() {
  return useQuery({
    queryKey: ['menus-by-group'],
    queryFn: () => MenuAxios.fetchDataMenusByGroup(),
  });
}

// POST Create Menu
export function useCreateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MenuInterfaces.PayloadMenuType) => MenuAxios.posMenus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      queryClient.invalidateQueries({ queryKey: ['menus-by-group'] });
    },
  });
}

// PATCH Update Menu
export function useUpdateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MenuInterfaces.PayloadMenuType }) =>
      MenuAxios.updateMenus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      queryClient.invalidateQueries({ queryKey: ['menus-by-group'] });
    },
  });
}

// DELETE Menu
export function useDeleteMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => MenuAxios.deleteMenus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      queryClient.invalidateQueries({ queryKey: ['menus-by-group'] });
    },
  });
}
