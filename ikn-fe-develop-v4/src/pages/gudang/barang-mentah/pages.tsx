import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import PenerimaanBarang from './structure/Component/Tabs/PenerimaanBarang';
import InformasiStok from './structure/Component/Tabs/InformasiStok';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Penerimaan Barang',
    children: <PenerimaanBarang />,
  },
  {
    key: '2',
    label: 'Informasi Stok',
    children: <InformasiStok />,
  },
];

export default function BarangMentahPage() {
  return <Tabs defaultActiveKey="1" items={items} />;
}
