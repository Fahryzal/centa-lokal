'use client';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Space } from 'antd';
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
import * as MarektingAxios from '@/modules/dashboard/service/MarektingAxios';
import dayjs from 'dayjs';
import { showNotification } from '@/contexts/services/notificationService';
import { handleMessageError } from '@/utils/func/func';
import { fetchDataKategori } from '@pages/master/kategori/service/kategoriAxios';

const { Option } = Select;

export interface RawDataType {
  month: string;
  year: number;
  status: string;
  product: string;
  value: number;
}

// Warna khusus per status
const statusColors: Record<string, string> = {
  Draft: '#3D74B6',
  DELIVERY: '#FF6F3C',
  Selesai: '#B6F500',
  APPROVED: '#009688',
};

export const SalesStatusStackedChart = ({
  unitId,
  typePo,
}: {
  unitId: string;
  typePo: 'RA' | 'RN' | 'RN_EKSPOR';
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (dayjs().month() + 1).toString().length > 1
      ? (dayjs().month() + 1).toString()
      : `0${dayjs().month() + 1}`
  );
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [data, setData] = useState<RawDataType[] | null>([]);
  const [dataTable, setTable] = useState({
    data: [],
    page: 1,
    limit: 1000,
    loading: false,
    kode: null,
    nama: '',
    total: 0,
  });

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, selectedProduct, unitId]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchDataKategori(dataTable);
        setTable((prev) => ({
          ...prev,
          data: res?.data?.data?.data || [],
          loading: false,
          total: res?.data?.data?.totalData || 0,
        }));
      } catch (e) {
        const message = handleMessageError(e);
        showNotification('error', 'Gagal', message);
      }
    };
    fetch();
  }, [dataTable.nama]);

  const fetchData = async () => {
    try {
      const params = {
        year: selectedYear,
        month: selectedMonth,
        kategori: selectedProduct,
        unitId: unitId,
        typePo: typePo,
      };
      const data = await MarektingAxios.fetchDataChar(params);
      const chartData = data.reduce((acc: any[], cur: RawDataType) => {
        const row = acc.find((x) => x.month === cur.month);

        if (row) {
          row[cur.status] = (row[cur.status] || 0) + cur.value;
        } else {
          acc.push({
            month: cur.month,
            [cur.status]: cur.value,
          });
        }

        return acc;
      }, []);

      setData(chartData);
    } catch (e) {
      const message = handleMessageError(e);
      showNotification('error', 'Terjadi Kesalahan', message);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 8 }}>
          <p style={{ margin: 0 }}>
            <b>{label}</b>
          </p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ margin: 0, color: p.fill }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <DatePicker
          format="YYYY"
          defaultValue={dayjs()}
          picker="year"
          onChange={(v) => setSelectedYear(v.year())}
        />

        <Select
          placeholder="Pilih Bulan"
          allowClear
          onChange={(val) => setSelectedMonth(val)}
          style={{ width: 150 }}
          defaultValue={
            (dayjs().month() + 1).toString().length > 1
              ? (dayjs().month() + 1).toString()
              : `0${dayjs().month() + 1}`
          }
        >
          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month) => (
            <Option key={month} value={month}>
              {month}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Pilih Produk"
          allowClear
          showSearch
          onChange={(val) => setSelectedProduct(val)}
          onSearch={(val) => setTable((prev: any) => ({ ...prev, namaBarang: val }))}
          style={{ width: 180 }}
        >
          {dataTable.data.map((p: any, i) => (
            <Option key={i} value={p.nama}>
              {p.nama}
            </Option>
          ))}
        </Select>
      </Space>

      <ResponsiveContainer
        style={{
          fontSize: 10,
        }}
        width="100%"
        height={400}
      >
        <BarChart data={data as any} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {Object.keys(statusColors).map((status) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="a"
              fill={statusColors[status]}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
