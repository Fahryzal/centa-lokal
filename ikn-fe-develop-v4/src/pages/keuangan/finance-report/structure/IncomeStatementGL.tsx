'use client';

import React, { useEffect, useState } from 'react';
import { Table, Typography, Divider, Card, DatePicker, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type GLItem = {
  name: string;
  type: 'REVENUE' | 'EXPENSE';
  normalBalance: 'DEBIT' | 'CREDIT';
  debit: number;
  credit: number;
};

type IncomeStatementResponse = {
  revenues: GLItem[];
  expenses: GLItem[];
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
};

const currency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);

const columns: ColumnsType<GLItem> = [
  {
    title: 'Nama Akun',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Tipe',
    dataIndex: 'type',
    key: 'type',
    render: (type) => (type === 'REVENUE' ? 'Pendapatan' : 'Beban'),
  },
  {
    title: 'Normal Balance',
    dataIndex: 'normalBalance',
    key: 'normalBalance',
  },
  {
    title: 'Debit',
    dataIndex: 'debit',
    key: 'debit',
    render: (value) => currency(value),
  },
  {
    title: 'Kredit',
    dataIndex: 'credit',
    key: 'credit',
    render: (value) => currency(value),
  },
];

const IncomeStatementGL: React.FC = () => {
  const [data, setData] = useState<IncomeStatementResponse | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      // Simulasi fetch dari API
      // Ganti ini dengan panggilan ke backend menggunakan fetch/axios
      const response = {
        revenues: [
          {
            name: 'Pendapatan Penjualan',
            type: 'REVENUE',
            normalBalance: 'CREDIT',
            debit: 0,
            credit: 100000,
          },
        ],
        expenses: [],
        totalRevenue: 100000,
        totalExpense: 0,
        netProfit: 100000,
      };

      // Jika backend support filter tanggal, kirim `start` dan `end`
      console.log('Fetching data for:', { start, end });

      setData(response as any);
    } catch (error) {
      message.error('Gagal mengambil data laporan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    setDateRange(dates);
    if (dates) {
      const [start, end] = dates;
      fetchData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    } else {
      fetchData();
    }
  };

  return (
    <Card
      title={<Title level={4}>Laporan Laba Rugi (General Ledger)</Title>}
      style={{ padding: 24 }}
    >
      <Space style={{ marginBottom: 16, display: 'block' }}>
        <Text>Pilih Periode:</Text>
        <RangePicker
          value={dateRange || null}
          onChange={(e) => handleRangeChange(e as any)}
          format="YYYY-MM-DD"
        />
      </Space>

      <Divider orientation="left">Pendapatan</Divider>
      <Table
        dataSource={data?.revenues || []}
        columns={columns}
        pagination={false}
        rowKey="name"
        loading={loading}
      />

      <Divider orientation="left">Beban</Divider>
      <Table
        dataSource={data?.expenses || []}
        columns={columns}
        pagination={false}
        rowKey="name"
        loading={loading}
        locale={{ emptyText: 'Tidak ada data beban' }}
      />

      <Divider />

      <Card style={{ maxWidth: 400 }}>
        <Text strong>Total Pendapatan: </Text>
        <Text>{currency(data?.totalRevenue || 0)}</Text>
        <br />
        <Text strong>Total Beban: </Text>
        <Text>{currency(data?.totalExpense || 0)}</Text>
        <br />
        <Text strong>Laba Bersih: </Text>
        <Text type="success">{currency(data?.netProfit || 0)}</Text>
      </Card>
    </Card>
  );
};

export default IncomeStatementGL;
