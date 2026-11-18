import { Pie } from '@ant-design/charts';
import { Divider, Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

// Data berdasarkan bulan
const monthlyData: Record<string, { type: string; value: number }[]> = {
  '2025-01': [
    { type: 'Used', value: 70 },
    { type: 'Available', value: 30 },
  ],
  '2025-02': [
    { type: 'Used', value: 60 },
    { type: 'Available', value: 40 },
  ],
  '2025-03': [
    { type: 'Used', value: 50 },
    { type: 'Available', value: 50 },
  ],
};

export const WarehouseCapacityDonut = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-01');

  const config = {
    data: monthlyData[selectedMonth] || [],
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.7,
    radius: 0.9,
    label: {
      type: 'inner',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 16, fontWeight: 500 },
    },
    legend: false,
    statistic: false,
    height: 300,
  };

  return (
    <div>
      <Select
        value={selectedMonth}
        onChange={setSelectedMonth}
        style={{ width: 200, marginBottom: 16 }}
      >
        {Object.keys(monthlyData).map((month) => (
          <Option key={month} value={month}>
            {new Date(month).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
            })}
          </Option>
        ))}
      </Select>
      <Divider />

      <Pie {...config} />
    </div>
  );
};
