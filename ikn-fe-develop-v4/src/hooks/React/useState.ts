import { useState as useStateGlobal } from 'react';

/**
 * Custom global useState
 * Tujuan: menyederhanakan logika state agar mudah diubah global
 * jika nanti ingin ganti library (misal ke Zustand, Jotai, Recoil, dll)
 */
export function useState<T>(initialValue: T) {
  const [state, setState] = useStateGlobal<T>(initialValue);
  return [state, setState] as const;
}
