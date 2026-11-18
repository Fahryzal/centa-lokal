import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import PenerimaanBarang from './structure/Component/Tabs/PenerimaanBarang';
import InformasiStok from './structure/Component/Tabs/InformasiStok';
import KartuGudang from './structure/Component/Tabs/kartuGudang';

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
  {
    key: '3',
    label: 'Kartu Gudang',
    children: <KartuGudang />,
  },
  // {
  //   key: '4',
  //   label: 'Mutasi Stok',
  //   children: 'In progress',
  // },
];

export default function BarangJadiPage() {
  return <Tabs defaultActiveKey="1" items={items} />;
}
