import { Table, Typography, DatePicker, Divider } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Title } = Typography;

const columns = [
  { title: 'Kode', dataIndex: 'code', key: 'code' },
  { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
  { title: 'Satuan', dataIndex: 'unit', key: 'unit' },
  { title: 'Stok', dataIndex: 'stock', key: 'stock' },
];

const data = [
  { key: '1', name: 'Besi', code: 'BRG001', stock: 120, unit: 'kg' },
  { key: '2', name: 'Semen', code: 'BRG002', stock: 40, unit: 'sak' },
  { key: '3', name: 'Cat', code: 'BRG003', stock: 10, unit: 'kaleng' },
];

export const StockTable = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Stok Barang: {selectedMonth.format('MMMM YYYY')}
        </Title>
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={(date) => date && setSelectedMonth(date)}
          allowClear={false}
        />
      </div>
      <Divider />

      <Table columns={columns} dataSource={data} pagination={false} bordered size="middle" />
    </div>
  );
};
