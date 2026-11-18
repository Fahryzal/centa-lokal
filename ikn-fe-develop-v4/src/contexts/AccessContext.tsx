// src/contexts/AccessContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import * as ContextServiceAxios from '@/contexts/services/ContextServiceAxios';
import { message } from 'antd';
import { getAccessToken } from '@/api/authService';

export interface MenuAccessType {
  menu: string;
  children: ChildType[];
}

export interface ChildType {
  menu: string;
  path: string;
  actions: ActionsType;
}

export interface ActionsType {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export interface AccessContextType {
  user: {
    id: string;
    name: string;
    email: string;
    isPusat: boolean;
    isRoot: 'Y' | 'N';
  } | null;
  access: MenuAccessType[];
  loading: boolean;
  unit: {
    nama: string;
    id: string;
  } | null;
}

const AccessContext = createContext<AccessContextType>({
  user: null,
  access: [],
  loading: true,
  unit: null,
});

export const useAccess = () => useContext(AccessContext);

export const AccessProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AccessContextType['user']>(null);
  const [access, setAccess] = useState<MenuAccessType[]>([]);
  const [unit, setUnit] = useState<AccessContextType['unit']>(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      getLoginMe();
    }
  }, []);

  const getLoginMe = async () => {
    try {
      const data = await ContextServiceAxios.fetchLoginMe();
      setUser(data.user);
      setAccess(data.menuAccess);
      setUnit(data.unit);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      messageApi.error('Terjadi Kesalahan');
    }
  };

  return (
    <>
      {contextHolder}
      <AccessContext.Provider value={{ user, access, unit, loading }}>
        {children}
      </AccessContext.Provider>
    </>
  );
};
