import { filterAndRemoveKeys, ThrowError } from '@/utils/helper';
import api from '@/api/axiosInstance';
import * as MenuInterfaces from 'pages/user-management/interface/MenuInterfaces';

export const fetchDataMenus = async (
  params: MenuInterfaces.DatumType
): Promise<MenuInterfaces.DataType | undefined> => {
  const removeKeys = ['data', 'total']; // Properti yang ingin dihapus
  const fixObjParams = filterAndRemoveKeys(params, removeKeys);
  const queryString = new URLSearchParams(fixObjParams as any).toString();
  try {
    const result = await api.get<MenuInterfaces.MenuInterfaces>(
      `/api/v1/user-management/menus?${queryString}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataMenuById = async (
  id: string
): Promise<MenuInterfaces.DataFindOneMenu | undefined> => {
  try {
    const result = await api.get<MenuInterfaces.ResponseFindOneMenu>(
      `/api/v1/user-management/menus/${id}`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const fetchDataMenusByGroup = async (): Promise<MenuInterfaces.DataType | undefined> => {
  try {
    const result = await api.get<MenuInterfaces.MenuInterfaces>(
      `/api/v1/user-management/menus/by-group`
    );
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const posMenus = async (data: MenuInterfaces.PayloadMenuType) => {
  try {
    const result = await api.post(`/api/v1/user-management/menus`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const updateMenus = async (id: number, data: MenuInterfaces.PayloadMenuType) => {
  try {
    const result = await api.patch(`/api/v1/user-management/menus/${id}`, data);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};

export const deleteMenus = async (id: number) => {
  try {
    const result = await api.delete(`/api/v1/user-management/menus/${id}`);
    if (![200, 201].includes(result.status)) {
      throw new Error('Terjadi kesalahan');
    }
    return result.data.data;
  } catch (e: any) {
    ThrowError(e);
  }
};
