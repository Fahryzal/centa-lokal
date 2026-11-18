import { useEffect, useState } from 'react';
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

import { Space } from 'antd';
import * as MarektingAxios from '@/modules/dashboard/service/MarektingAxios';
import { showNotification } from '@/contexts/services/notificationService';
import { currencyFormatter } from '@/utils/helper';
import dayjs from 'dayjs';
import { DatePicker } from '@/components/ui';

const BarChartPlanVsActual = ({
  unitId,
  typePo,
}: {
  unitId: string;
  typePo: 'RA' | 'RN' | 'RN_EKSPOR';
}) => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [dataChar, setData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    try {
      const params = {
        year: selectedYear,
        typePo: typePo,
        unitId: unitId,
      };
      const data = await MarektingAxios.fetchDataCharSalesPlanActual(params);
      setData(data);
    } catch (e) {
      showNotification('error', 'Terjadi Kesalahan', 'Terjadi Kesalahan');
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <Space
        style={{
          marginBottom: 16,
        }}
      >
        <DatePicker
          format="YYYY"
          defaultValue={dayjs()}
          picker="year"
          onChange={(v) => setSelectedYear(v.year())}
        />
      </Space>
      <ResponsiveContainer
        style={{
          fontSize: 10,
          marginTop: 20,
        }}
        width="100%"
        height={400}
      >
        <BarChart
          data={dataChar[selectedYear]}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }} // tambahkan margin, terutama left & top
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            width={90} // kasih lebar cukup supaya label "1.000.000 kg" muat
            tickFormatter={(value) => `${currencyFormatter(value)} kg`}
          />
          s
          <Tooltip formatter={(value: any) => `${currencyFormatter(value)} kg`} />
          <Legend />
          <Bar dataKey="plan" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartPlanVsActual;
