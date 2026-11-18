'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpanse } from '../hooks/useAkuntansi';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { currencyFormatter } from '@/utils/helper';
import dayjs from 'dayjs';
import { DatePicker } from '@/components/ui';
import { Space } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4C4C'];

function shortRp(value: number): string {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(2)} M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(2)} jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)} rb`;
  return `Rp ${currencyFormatter(value)}`;
}

const ExpenseBreakdownChart = ({ unitId }: { unitId: string }) => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const { data, isLoading, isError } = useExpanse({ year: selectedYear, unitId });

  const chartData = useMemo(() => data?.filter((item) => item.parentId !== null) ?? [], [data]);

  const total = useMemo(() => data?.find((item) => item.parentId === null)?.value ?? 0, [data]);

  if (isError) return <AlertCustome />;

  return (
    <div>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {/* Header */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 4 }}>Komposisi Biaya</h3>
            <p style={{ marginTop: 0, color: '#999' }}>
              Mengetahui komponen biaya terbesar (misalnya gaji, sewa, operasional, dll)
            </p>
            <Space>
              <DatePicker
                format="YYYY"
                defaultValue={dayjs()}
                picker="year"
                onChange={(v) => setSelectedYear(v.year())}
              />
            </Space>
          </div>

          {/* Donut chart */}
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData as any}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={68}
                  paddingAngle={2}
                  label={false}
                  labelLine={false}
                >
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`Rp ${currencyFormatter(Number(val))}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label — absolute overlay */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: 11, color: '#999', whiteSpace: 'nowrap' }}>Total biaya</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111', whiteSpace: 'nowrap' }}>
                {shortRp(total)}
              </div>
            </div>
          </div>

          {/* Custom legend — wrap grid, di luar PieChart */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 12px',
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #f0f0f0',
            }}
          >
            {chartData.map((entry: any, index: number) => {
              const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';
              return (
                <div
                  key={index}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12 }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: COLORS[index % COLORS.length],
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <span style={{ color: '#555', lineHeight: '1.3' }}>
                    {entry.category}
                    <span style={{ color: '#111', fontWeight: 600, marginLeft: 4 }}>{pct}%</span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseBreakdownChart;
