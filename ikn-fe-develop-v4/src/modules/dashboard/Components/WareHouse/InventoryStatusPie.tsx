import { useState } from 'react';
import { Pie } from '@ant-design/charts';
import { DatePicker, Divider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { MonthPicker } = DatePicker;

const dummyData: any = {
  '2025-08': [
    { type: 'Aman', value: 80 },
    { type: 'Menipis', value: 15 },
    { type: 'Habis', value: 5 },
  ],
  '2025-07': [
    { type: 'Aman', value: 60 },
    { type: 'Menipis', value: 25 },
    { type: 'Habis', value: 15 },
  ],
};

export const InventoryStatusPie = () => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());
  const monthKey = selectedMonth?.format('YYYY-MM') || dayjs().format('YYYY-MM');
  const data = dummyData[monthKey] || [];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
      style: { fontSize: 14 },
    },
    height: 300,
    autoFit: true,
  };

  return (
    <div>
      <MonthPicker
        value={selectedMonth}
        onChange={(date) => setSelectedMonth(date)}
        // picker="month"
        format="MMMM YYYY"
        style={{ marginBottom: 16 }}
      />
      <Divider />
      <Pie {...config} />
    </div>
  );
};
