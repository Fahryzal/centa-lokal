import { useEffect as useGlobalEffect } from 'react';

interface GlobalEffectOptions {
  deps?: any[];
  onMount?: () => void | (() => void);
  onUnmount?: () => void;
}

type GlobalEffectParam =
  | (() => void | (() => void)) // gaya asli React
  | GlobalEffectOptions; // gaya custom

export function useEffect(param: GlobalEffectParam, depsArg?: any[]) {
  useGlobalEffect(param as any, depsArg);
}
