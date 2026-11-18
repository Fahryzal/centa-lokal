import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import * as MarektingAxios from '@/modules/dashboard/service/MarektingAxios';
import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';
import dayjs from 'dayjs';
import { DatePicker } from '@/components/ui';

const { Option } = Select;

const monthOptions = [
  { label: 'Januari', value: 1 },
  { label: 'Februari', value: 2 },
  { label: 'Maret', value: 3 },
  { label: 'April', value: 4 },
  { label: 'Mei', value: 5 },
  { label: 'Juni', value: 6 },
  { label: 'Juli', value: 7 },
  { label: 'Agustus', value: 8 },
  { label: 'September', value: 9 },
  { label: 'Oktober', value: 10 },
  { label: 'November', value: 11 },
  { label: 'Desember', value: 12 },
];

// warna slice
const COLORS = ['#ff7f7f', '#82ca9d', '#8884d8'];

export const InvoiceStatusDonut = ({
  unitId,
  typePo,
}: {
  unitId: string;
  typePo: 'RA' | 'RN' | 'RN_EKSPOR';
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month() + 1); // default: Agustus

  const [dataChar, setData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, unitId]);

  const fetchData = async () => {
    try {
      const params = {
        year: selectedYear,
        month: selectedMonth,
        unitId: unitId,
        typePo: typePo,
      };
      const data = await MarektingAxios.fetchDataCharInvoice(params);

      const dataResult = data[selectedYear]?.[selectedMonth] || [];
      const total = dataResult.reduce((sum: any, d: any) => sum + d.value, 0);
      setData((prev: any) => ({
        ...prev,
        total: total,
        data: dataResult,
      }));
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Terjadi Kesalahan', message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'start', marginBottom: 12 }}>
        <Space>
          <Select
            value={selectedMonth}
            onChange={(month) => setSelectedMonth(month)}
            style={{ width: 140 }}
            size="middle"
            placeholder="Pilih Bulan"
          >
            {monthOptions.map((m) => (
              <Option key={m.value} value={m.value}>
                {m.label}
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
      </div>

      <ResponsiveContainer
        style={{
          fontSize: 10,
        }}
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={dataChar.data}
            dataKey="value"
            nameKey="type"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            // label={({ type, value }) => `${type}: ${value} transaksi`}
          >
            {dataChar?.data?.map((_entry: any, index: any) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value} transaksi`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ textAlign: 'center', marginTop: 10, fontWeight: 600 }}>
        Total: {dataChar.total} transaksi
      </div>
    </div>
  );
};
