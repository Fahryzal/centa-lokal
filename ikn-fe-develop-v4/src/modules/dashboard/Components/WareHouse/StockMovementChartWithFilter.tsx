import { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker, Typography, Divider, Select, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// extend plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

export const StockMovementChartWithFilter = () => {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const rawData = [
    { type: 'Masuk', date: '2025-08-01', qty: 100, product: 'Produk A' },
    { type: 'Keluar', date: '2025-08-01', qty: 70, product: 'Produk A' },
    { type: 'Masuk', date: '2025-08-02', qty: 80, product: 'Produk B' },
    { type: 'Keluar', date: '2025-08-02', qty: 50, product: 'Produk B' },
    { type: 'Masuk', date: '2025-08-05', qty: 60, product: 'Produk A' },
  ];

  const products = Array.from(new Set(rawData.map((d) => d.product)));

  // filter by range & product
  const filteredData = rawData.filter((item) => {
    const inRange = range
      ? dayjs(item.date).isSameOrAfter(range[0], 'day') &&
        dayjs(item.date).isSameOrBefore(range[1], 'day')
      : true;

    const matchProduct = selectedProduct ? item.product === selectedProduct : true;

    return inRange && matchProduct;
  });

  // transform to grouped format for Recharts
  const groupedData: any = {};

  filteredData.forEach((item) => {
    if (!groupedData[item.date]) {
      groupedData[item.date] = { date: item.date, Masuk: 0, Keluar: 0, Total: 0 };
    }
    groupedData[item.date][item.type] += item.qty;
    groupedData[item.date].Total += item.qty;
  });

  const chartData = Object.values(groupedData);

  // Custom tooltip with satuan kg
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 8 }}>
          <p style={{ margin: 0 }}>
            <b>{label}</b>
          </p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ margin: 0, color: p.fill }}>
              {p.name}: {p.value} kg
            </p>
          ))}
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            Total: {payload.reduce((sum: number, p: any) => sum + p.value, 0)} kg
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Pergerakan Stok (RA)
        </Title>
        <Space>
          <Select
            placeholder="Pilih Produk"
            allowClear
            onChange={(val) => setSelectedProduct(val)}
            style={{ width: 160 }}
          >
            {products.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>
          <RangePicker
            onChange={(dates) => setRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            allowClear
          />
        </Space>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(val) => `${val} kg`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Masuk" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Keluar" stackId="a" fill="#ff7f50"></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
