'use client';

import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
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
import { useNetProfit } from '../hooks/useAkuntansi';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { currencyFormatter } from '@/utils/helper';
import dayjs from 'dayjs';

// warna khusus per produk
const productColors: Record<string, string> = {
  RA: '#52c41a',
  RN: '#1890ff',
  RN_EKSPOR: '#f5222d',
};

const NetProfitData: React.FC = () => {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<number>(Number(currentYear));

  const { data, isLoading, isError } = useNetProfit({
    year: selectedYear,
  });
  // kalau pilih "all", kita harus reshape data jadi 1 row = banyak produk
  const chartData = data?.reduce((acc: any[], cur: any) => {
    const existing = acc.find((a) => a.month === cur.month);
    if (existing) {
      existing[cur.product] = cur.netProfit;
    } else {
      acc.push({ month: cur.month, [cur.product]: cur.netProfit });
    }
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 8 }}>
          <p style={{ margin: 0 }}>
            <b>{label}</b>
          </p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ margin: 0, color: p.stroke }}>
              {p.name}: {currencyFormatter(p.value)}
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
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 4 }}>Omset</h3>
            <p style={{ margin: 0, color: '#999' }}>Menampilkan Omser aktual</p>
            <Space style={{ marginTop: 8 }}>
              <DatePicker
                format="YYYY"
                defaultValue={dayjs()}
                picker="year"
                onChange={(v) => setSelectedYear(v.year())}
              />
            </Space>
          </div>

          <ResponsiveContainer
            style={{
              fontSize: 12,
            }}
            width="100%"
            height={400}
          >
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${currencyFormatter(Number(v))}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {Object.keys(productColors).map((product) => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  stroke={productColors[product]}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default NetProfitData;
