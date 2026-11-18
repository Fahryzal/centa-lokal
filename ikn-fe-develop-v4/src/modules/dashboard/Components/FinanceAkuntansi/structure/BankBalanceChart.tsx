'use client';

import { useState } from 'react';
// import { Bar } from '@ant-design/plots';
import { DatePicker, Select, Space } from 'antd';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useBankBalance } from '../hooks/useAkuntansi';
import dayjs from 'dayjs';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { currencyFormatter } from '@/utils/helper';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const { Option } = Select;

const monthOptions = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

const BankBalanceChart = ({ unitId }: { unitId: string }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    String(dayjs().month() + 1).padStart(2, '0') as any
  );
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const { data, isLoading, isError } = useBankBalance({
    year: selectedYear,
    unitId: unitId,
    month: selectedMonth as any,
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const datum = payload[0].payload;

      return (
        <div
          style={{
            background: 'white',
            padding: 10,
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{datum.bankName}</p>
          <p style={{ margin: 0 }}>{`Rp.${currencyFormatter(datum.balance)}`}</p>
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
          <h3 style={{ marginBottom: 4 }}>Saldo Bank per Akun</h3>
          <p style={{ marginTop: 0, color: '#999' }}>
            Menunjukkan berapa saldo di setiap rekening bank secara real-time
          </p>
          <Space style={{ marginBottom: 16 }}>
            <Select value={selectedMonth} onChange={setSelectedMonth} style={{ width: 140 }}>
              {monthOptions.map((month) => (
                <Option key={month.value} value={month.value}>
                  {month.label}
                </Option>
              ))}
            </Select>

            <DatePicker
              format="YYYY"
              defaultValue={dayjs()}
              picker="year"
              onChange={(v) => setSelectedYear(v.year())}
            />
          </Space>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v) => `Rp ${currencyFormatter(v)}`} // custom label
              />
              <YAxis type="category" dataKey="bankName" />

              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="balance" radius={[4, 4, 4, 4]}>
                {data?.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>{' '}
        </>
      )}
    </div>
  );
};

export default BankBalanceChart;
