'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCashFLow } from '../hooks/useAkuntansi';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { DatePicker } from '@/components/ui';
import dayjs from 'dayjs';
import { Space } from 'antd';
const CashFlowChart = ({ unitId }: { unitId: string }) => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const { data, isLoading, isError } = useCashFLow({ unitId: unitId, year: selectedYear });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            padding: '8px',
          }}
        >
          <p style={{ marginBottom: 4 }}>
            <b>{label}</b>
          </p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ margin: 0, color: p.stroke }}>
              {p.name}: Rp {p.value.toLocaleString('id-ID')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  if (isError) {
    return <AlertCustome />;
  }

  return (
    <div>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <h3>Arus Kas (Cash Flow)</h3>
            <Space>
              <DatePicker
                format="YYYY"
                defaultValue={dayjs()}
                picker="year"
                onChange={(v) => setSelectedYear(v.year())}
              />
            </Space>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `Rp ${v.toLocaleString('id-ID')}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cashIn"
                name="Cash In"
                stroke="#52c41a"
                strokeWidth={3}
                dot
              />
              <Line
                type="monotone"
                dataKey="cashOut"
                name="Cash Out"
                stroke="#f5222d"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default CashFlowChart;
