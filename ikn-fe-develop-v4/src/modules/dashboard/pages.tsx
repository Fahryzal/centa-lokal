import { useAccess } from '@/contexts/AccessContext';
import PagePusat from './Components/PagePusat/PagePusat';
import Loading from '@/components/atoms/Loading/Loading';

const DashboardPage = () => {
  const { unit, loading } = useAccess();

  if (loading) return <Loading />;

  return <PagePusat unit={unit} />;
};

export default DashboardPage;
