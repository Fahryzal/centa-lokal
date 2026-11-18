'use client';

import React, { useEffect, useState } from 'react';
import { Select, Space } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useBuyer } from '../hooks/useMarketing';
import { useBarangjadi } from '@/pages/master/barang-jadi/hooks/BarangJadiHooks';
import AlertCustome from '@/components/atoms/AlertCustome/AlertCustome';
import Loading from '@/components/atoms/Loading/Loading';
import { useCustomer } from '@/pages/master/customer/hooks/CustomerHooks';
import { DatePicker } from '@/components/ui';
import dayjs from 'dayjs';
const { Option } = Select;

const COLORS_PAYMENT = ['#1890ff', '#13c2c2', '#722ed1'];
const COLORS_ITEMS = ['#52c41a', '#fa8c16', '#eb2f96'];
const months = [
  { number: 1, code: '01', name: 'Januari' },
  { number: 2, code: '02', name: 'Februari' },
  { number: 3, code: '03', name: 'Maret' },
  { number: 4, code: '04', name: 'April' },
  { number: 5, code: '05', name: 'Mei' },
  { number: 6, code: '06', name: 'Juni' },
  { number: 7, code: '07', name: 'Juli' },
  { number: 8, code: '08', name: 'Agustus' },
  { number: 9, code: '09', name: 'September' },
  { number: 10, code: '10', name: 'Oktober' },
  { number: 11, code: '11', name: 'November' },
  { number: 12, code: '12', name: 'Desember' },
];

const BuyerChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(dayjs().month() + 1).padStart(2, '0') as any
  );
  const [nameProduk, setnameProduk] = useState<string>('');
  const [nameCust, setnameCust] = useState<string>('');
  const {
    data: dataBrangJadi,
    isLoading: isLoadingBarangJadi,
    isError: isErrorBarangJadi,
  } = useBarangjadi({ page: 1, limit: 10, namaBarang: nameProduk });
  const {
    data: dataCust,
    isLoading: isLoadingCust,
    isError: isErrorCust,
  } = useCustomer({ page: 1, limit: 10, name: nameCust });
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>(''); // State untuk produk
  const { data, isLoading, isError } = useBuyer({
    namaBarang: selectedProduct,
    year: selectedYear,
    customerName: selectedCompany,
    month: selectedMonth,
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: 8 }}>
          <p style={{ margin: 0 }}>
            <b>{label}</b>
          </p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ margin: 0, color: p.fill }}>
              {p.name}: {Number(p.value).toLocaleString('id-ID')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setSelectedProduct(dataBrangJadi?.data.data.data[0].namaBarang || '');
    setSelectedCompany(dataCust?.data.data.data[0].name || '');
  }, [dataBrangJadi]);

  if (isError || isErrorBarangJadi || isErrorCust) {
    return <AlertCustome />;
  }

  return (
    <div>
      {isLoading || isLoadingBarangJadi || (isLoadingCust && <Loading />)}
      {!isLoading && !isLoadingBarangJadi && !isLoadingCust && (
        <>
          <h3 style={{ marginBottom: 4 }}>Pembeli & Transaksi</h3>
          <p style={{ margin: 0, color: '#999' }}>
            Menampilkan jumlah pembayaran dan jumlah barang per perusahaan
          </p>

          <Space style={{ marginTop: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <DatePicker
              format="YYYY"
              defaultValue={dayjs()}
              picker="year"
              onChange={(v) => setSelectedYear(v.year())}
            />
            <Select
              value={selectedMonth || dataBrangJadi?.data.data.data[0].namaBarang}
              onChange={setSelectedMonth}
              style={{ width: 120 }}
            >
              {months?.map((m, i) => (
                <Option key={i} value={m.code}>
                  {m.name}
                </Option>
              ))}
            </Select>
            <Select
              showSearch
              onSearch={(val) => setnameCust(val)}
              value={selectedCompany}
              onChange={setSelectedCompany}
              style={{ width: 120 }}
            >
              {dataCust?.data.data.data?.map((c, i) => (
                <Option key={i} value={c.name}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <Select
              showSearch
              onSearch={(val) => setnameProduk(val)}
              value={selectedProduct}
              onChange={setSelectedProduct}
              style={{ width: 120 }}
            >
              {dataBrangJadi?.data.data.data?.map((p, i) => (
                <Option key={i} value={p.namaBarang}>
                  {p.namaBarang}
                </Option>
              ))}
            </Select>
          </Space>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={12}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" />
              <YAxis tickFormatter={(v) => v.toLocaleString('id-ID')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Bar dataKey="payment" name="Jumlah Pembayaran" radius={[6, 6, 0, 0]}>
                {data?.map((_, index) => (
                  <Cell
                    key={`cell-payment-${index}`}
                    fill={COLORS_PAYMENT[index % COLORS_PAYMENT.length]}
                  />
                ))}
              </Bar>

              <Bar dataKey="items" name="Jumlah Barang" radius={[6, 6, 0, 0]}>
                {data?.map((_, index) => (
                  <Cell
                    key={`cell-items-${index}`}
                    fill={COLORS_ITEMS[index % COLORS_ITEMS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default BuyerChart;
