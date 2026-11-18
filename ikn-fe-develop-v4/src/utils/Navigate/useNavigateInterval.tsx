import { NavigateFunction } from 'react-router-dom';

export const navigateWithInterval = (
  navigate: NavigateFunction,
  path: string,
  delay: number = 1000
) => {
  const interval = setInterval(() => {
    navigate(path);
  }, delay);

  // balikin fungsi buat stop interval
  return () => clearInterval(interval);
};
