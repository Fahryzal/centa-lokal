import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { WarehouseDashboard } from '../WareHouse/DashboardGudang';
import { DashboardMarketing } from '../Marketing/DashboardMarketing';
import { DashboardFinanceAkuntansi } from '../FinanceAkuntansi/structure/DashboardFinanceAkuntansi';
import { useSearchParams } from 'react-router';

interface PagePusatProps {
  unit: {
    nama: string;
  } | null;
}

const unitIdRA = import.meta.env.VITE_ID_UNIT_RA;
const unitIdRN = import.meta.env.VITE_ID_UNIT_RN;
const unitPusat = import.meta.env.VITE_ID_UNIT_PUSAT;
const unitIdRubberThread = import.meta.env.VITE_ID_UNIT_RUBBER_THREAD;

const PagePusat: React.FC<PagePusatProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || '1';

  const onChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Pemasaran Unit RA',
      children: <DashboardMarketing unitId={unitIdRA} typePo="RA" />,
    },
    {
      key: '2',
      label: 'Pemasaran Unit RN',
      children: <DashboardMarketing unitId={unitIdRN} typePo="RN" />,
    },
    {
      key: '3',
      label: 'Pemasaran Unit RN Ekspor',
      children: <DashboardMarketing unitId={unitIdRN} typePo="RN_EKSPOR" />,
    },
    {
      key: '4',
      label: 'Akuntansi RA',
      children: <DashboardFinanceAkuntansi unitId={unitIdRA} typePo="RA" />,
    },
    {
      key: '5',
      label: 'Akuntansi RN',
      children: <DashboardFinanceAkuntansi unitId={unitIdRN} typePo="RN" />,
    },
    {
      key: '6',
      label: 'Akuntansi Pusat',
      children: <DashboardFinanceAkuntansi unitId={unitPusat} typePo="RA" />,
    },
    {
      key: '7',
      label: 'Gudang RA',
      children: (
        <WarehouseDashboard
          unitId={unitIdRA}
          rawMaterialUnitIds={`${unitIdRA},${unitIdRubberThread}`}
        />
      ),
    },
    {
      key: '8',
      label: 'Gudang RN',
      children: <WarehouseDashboard unitId={unitIdRN} />,
    },
  ];

  return <Tabs activeKey={activeTab} items={items} onChange={onChange} />;
};

export default PagePusat;
