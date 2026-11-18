import { useNavigate } from 'react-router-dom';

export function useAppNavigate() {
  const navigate = useNavigate();
  return (path: string) => navigate(path);
}
