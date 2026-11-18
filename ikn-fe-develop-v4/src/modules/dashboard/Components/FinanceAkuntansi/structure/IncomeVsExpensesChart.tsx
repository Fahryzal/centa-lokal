import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useIncomeExpense } from '../hooks/useAkuntansi';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { currencyFormatter } from '@/utils/helper';

const IncomeVsExpensesChart = ({
  unitId,
}: {
  unitId: string;
  typePo: 'RA' | 'RN' | 'RN_EKSPOR';
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const { isLoading, data, isError } = useIncomeExpense({
    year: selectedYear as any,
    unitId: unitId,
  });

  // custom tooltip
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
            <p key={p.name} style={{ margin: 0, color: p.fill }}>
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
          {' '}
          <div style={{ marginBottom: 16, display: 'block' }}>
            <span style={{ marginRight: 8 }}>Tahun:</span>
            <DatePicker
              format="YYYY"
              defaultValue={dayjs()}
              picker="year"
              onChange={(v) => setSelectedYear(v.year())}
            />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `Rp ${currencyFormatter(v)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Income" fill="#33A1E0" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Expenses" fill="#f5222d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default IncomeVsExpensesChart;
