import { useState } from 'react';
import { Button, Drawer, Space, Table } from 'antd';
import * as globalHelpers from '@/utils/helper';
import type { TableColumnsType, TableProps } from 'antd';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
} //

const columns: TableColumnsType<DataType> = [
  { title: 'Nama Barang', dataIndex: 'namabarangProduct' },
  { title: 'Kode Barang', dataIndex: 'kodeBarangProduct' },
  { title: 'Kategori Brang', dataIndex: 'kategoriProduct' },
  { title: 'Jumlah Brang', dataIndex: 'quantity' },
  { title: 'Satuan Brang', dataIndex: 'satuanProduct' },
  { title: 'Spesifikasi Brang', dataIndex: 'spesifikasiProduct' },
  {
    title: 'Harga Brang',
    dataIndex: 'priceProduct',
    render: (priceProduct) => <span>Rp{globalHelpers.currencyFormatter(priceProduct || 0)}</span>,
  },
];

export default function DrawerSpb({
  openDrawer,
  seOpenDrawer,
  dataSourceItems,
  setDataSourceItemsSpb,
  dataLogs,
}: Readonly<{
  openDrawer: any;
  seOpenDrawer: Function;
  dataSourceItems: any;
  setDataSourceItemsSpb: Function;
  dataLogs: any;
}>) {
  const [selected, setSelected] = useState([]);

  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onSelect: (_record, _selected, selectedRows) => {
      // console.log('selectedRows',selectedRows)
      setSelected(selectedRows as any);
      // setDataSourceItemsSpb(selectedRows)
    },
    onSelectAll: (_selected, selectedRows) => {
      // setDataSourceItemsSpb(selectedRows)
      setSelected(selectedRows as any);
    },
  };

  const onClose = () => {
    seOpenDrawer((prev: any) => ({ ...prev, open: false }));
  };

  const dataSource = dataSourceItems.filter(
    (item: any) => !dataLogs.some((itemLog: any) => itemLog.productId === item.productId)
  );
  return (
    <Drawer
      title="Pilih Barang"
      placement={'right'}
      width={500}
      onClose={onClose}
      open={openDrawer.open}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => {
              setDataSourceItemsSpb(selected);
              setSelected([]);
              onClose();
            }}
          >
            OK
          </Button>
        </Space>
      }
    >
      <Table<DataType>
        rowKey="productId"
        scroll={{ x: 'max-content' }}
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columns}
        dataSource={dataSource}
      />
    </Drawer>
  );
}
