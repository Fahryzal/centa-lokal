'use client';

import { useState } from 'react';
import { Gauge } from '@ant-design/plots';
import { Select } from 'antd';

const { Option } = Select;

// Data dummy per tahun dan bulan
const targetData: Record<string, Record<string, { target: number; total: number }>> = {
  '2023': {
    Januari: { target: 120, total: 300 },
    Februari: { target: 159, total: 400 },
  },
  '2024': {
    Januari: { target: 200, total: 400 },
    Februari: { target: 300, total: 500 },
  },
  '2025': {
    Januari: { target: 100, total: 300 },
    Februari: { target: 160, total: 400 },
  },
};

const monthOptions = ['Januari', 'Februari'];

export const TargetAchievementGauge = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('Januari');

  const { target, total } = targetData[selectedYear]?.[selectedMonth] || { target: 0, total: 1 };

  const config = {
    autoFit: true,
    data: {
      target,
      total,
      name: 'pencapaian',
      thresholds: [100, 200, 400],
    },
    scale: {
      color: {
        range: ['#F4664A', '#FAAD14', 'green'],
      },
    },
    style: {
      textContent: (target: number, total: number) =>
        `Target: ${target}\nPencapaian: ${((target / total) * 100).toFixed(2)}%`,
    },
    height: 400,
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
          {Object.keys(targetData).map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
        <Select value={selectedMonth} onChange={setSelectedMonth} style={{ width: 120 }}>
          {monthOptions.map((month) => (
            <Option key={month} value={month}>
              {month}
            </Option>
          ))}
        </Select>
      </div>
      <Gauge {...config} />
    </div>
  );
};
