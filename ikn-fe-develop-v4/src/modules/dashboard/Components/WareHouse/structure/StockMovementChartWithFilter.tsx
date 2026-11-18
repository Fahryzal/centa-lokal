import { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker, Typography, Divider, Space, Input, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useInventoryProduct } from '../hooks/useWareHouse';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import ModalMasterBarangJadi from './Components/ModalMasterBarangJadi/ModalMasterBarangJadi';
import * as interfacesGlobal from '@/utils/interfaces/interfacesGlobal';
import { SearchOutlined } from '@ant-design/icons';

// extend plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Title } = Typography;

export const StockMovementChartWithFilter = ({ unitId }: { unitId: string }) => {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [productId, setProductId] = useState<string>('');
  const [productName, setProductName] = useState<string>('');

  const { data, isLoading, isError } = useInventoryProduct({
    unitId: unitId,
    productId,
    startDate: range?.[0]?.format('YYYY-MM-DD'),
    endDate: range?.[1]?.format('YYYY-MM-DD'),
  });
  const [open, setOpen] = useState<boolean>(false);

  // transform to grouped format for Recharts
  const groupedData: any = {};

  data?.forEach((item: any) => {
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

  const handleRowDoubleClick = (record: interfacesGlobal.ProductType) => {
    setProductId(record.id);
    setProductName(record.namaBarang);
    setOpen(false);
    // Bisa set state atau panggil fungsi untuk "select" row ini
  };

  if (isError) {
    return <AlertCustome />;
  }

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <ModalMasterBarangJadi
        open={open}
        setOpen={setOpen}
        handleRowDoubleClick={handleRowDoubleClick}
        unitId={unitId}
      />
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              Pergerakan Stok
            </Title>
            <Space>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input
                  disabled
                  style={{ flex: 1, width: '100%' }}
                  placeholder="Masukan Kode Barang"
                  value={productName}
                />

                <Button
                  type="primary"
                  onClick={() => setOpen(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </div>
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
        </>
      )}
    </div>
  );
};
