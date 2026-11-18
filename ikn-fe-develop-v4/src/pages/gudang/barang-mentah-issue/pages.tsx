import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import PengeluaranBarang from './structure/Component/Tabs/PengeluaranBarang';
import InformasiStok from './structure/Component/Tabs/InformasiStok';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Pengeluaran Barang',
    children: <PengeluaranBarang />,
  },
  {
    key: '2',
    label: 'Informasi Stok',
    children: <InformasiStok />,
  },
];

export default function BarangMentahIssuePage() {
  return <Tabs defaultActiveKey="1" items={items} />;
}
