import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import PengeluaranBarangJadi from './structure/Component/Tabs/PengeluaranBarang';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Pengeluaran Barang Jadi',
    children: <PengeluaranBarangJadi />,
  },
];

export default function BarangJadiIssuePage() {
  return <Tabs defaultActiveKey="1" items={items} />;
}
