import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Typography, Alert, Space, DatePicker, Select } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';

import * as SaldoKeuanganAxios from '@pages/keuangan/saldo-keuangan/service/SaldoKeuanganAxios';
import * as SaldoKeuanganInterfaces from '@pages/keuangan/saldo-keuangan/interface/SaldoKeuanganInterfaces';
import dayjs, { Dayjs } from 'dayjs';
import { showNotification } from '@/contexts/services/notificationService';
const dateFormat = 'YYYY/MM/DD';
import { User } from '@phosphor-icons/react';

import * as globalHelpers from '@/utils/helper';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import * as globalHooks from '@/hooks';
dayjs.locale('id');

const { RangePicker } = DatePicker;

const { Title, Text } = Typography;

const ProfitLossReport: React.FC = () => {
  const [data, setData] = useState<{
    loading: boolean;
    data: SaldoKeuanganInterfaces.ProfieLossType | null;
  }>({
    loading: false,
    data: null,
  });
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    unitId: '',
  });
  const formatCurrency = (value: number) => `Rp${value.toLocaleString('id-ID')}`;
  const columns = [
    {
      title: 'Akun Kode',
      dataIndex: 'accountCode',
      key: 'accountCode',
    },
    {
      title: 'Nama Akun',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Kredit',
      dataIndex: 'credit',
      key: 'credit',
      render: (value: number) => formatCurrency(value),
    },
  ];

  useEffect(() => {
    const startDate = dayjs(`${dayjs().year()}-01-01`); // 1 Januari tahun ini
    const endDate = dayjs(); // Hari ini
    fetchDataIncomeStateMent(startDate, endDate, unit.unitId);
  }, [unit.unitId]);

  const fetchDataIncomeStateMent = async (startDate: Dayjs, endDate: Dayjs, unitId: string) => {
    try {
      const data = await SaldoKeuanganAxios.fetchIncomeStatement(startDate, endDate, unitId);
      setData((prev) => ({ ...prev, data: data }));
    } catch (e) {
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleChangeDate = (value: [Dayjs | null, Dayjs | null] | null) => {
    if (value && value[0] && value[1]) {
      const startDate = value[0];
      const endDate = value[1];
      // Lanjutkan: kirim ke API, update state, dll
      fetchDataIncomeStateMent(startDate, endDate, unit.unitId);
    } else {
      showNotification('warning', 'Peringatan', 'Tanggal kosong atai tidak lengkap');
    }
  };

  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={3}>Laporan Laba Rugi</Title>

        <div
          style={{
            display: 'flex',
            gap: 2,
          }}
        >
          <Select
            prefix={<User />}
            onClear={() => setUnit((prev) => ({ ...prev, unitId: '' }))}
            showSearch
            loading={unit.loading}
            placeholder="Pilih unit"
            optionFilterProp="label"
            onChange={(e) => setUnit((prev) => ({ ...prev, unitId: e }))}
            options={[
              ...globalHelpers.toAntdOptionsV2(unit.data || [], 'id', 'nama'),
              { value: '', label: 'Semua' },
            ]}
          />

          <RangePicker
            style={{
              height: 30,
            }}
            onChange={(value) => handleChangeDate(value)}
            defaultValue={[
              dayjs(`${dayjs().year()}-01-01`), // 1 Januari tahun ini
              dayjs(), // Hari ini
            ]}
            format={dateFormat}
          />
        </div>
      </div>

      <Alert
        message={`Data terakhir diperbarui`}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Space>
              <ArrowUpOutlined style={{ color: 'green', fontSize: 24 }} />
              <div>
                <Text>Total Pendapatan</Text>
                <br />
                <Title level={4} style={{ margin: 0 }}>
                  {formatCurrency(data?.data?.totalRevenue || 0)}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Space>
              <ArrowDownOutlined style={{ color: 'red', fontSize: 24 }} />
              <div>
                <Text>Total Biaya</Text>
                <br />
                <Title level={4} style={{ margin: 0 }}>
                  {formatCurrency(data?.data?.totalExpense || 0)}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Space>
              <DollarOutlined style={{ color: '#1890ff', fontSize: 24 }} />
              <div>
                <Text>Laba Bersih</Text>
                <br />
                <Title level={4} style={{ margin: 0 }}>
                  {formatCurrency(data?.data?.netProfit || 0)}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Title level={5}>📊 Rincian Pendapatan</Title>
      <Table
        dataSource={data?.data?.revenues}
        columns={columns}
        rowKey="name"
        pagination={false}
        style={{ marginBottom: 24 }}
      />

      <Title level={5}>📉 Rincian Biaya</Title>
      {data?.data?.expenses && data?.data?.expenses?.length > 0 ? (
        <Table
          dataSource={data.data?.expenses}
          columns={columns}
          rowKey="name"
          pagination={false}
        />
      ) : (
        <Alert message="Belum ada data biaya dalam periode ini." type="warning" showIcon />
      )}
    </div>
  );
};

export default ProfitLossReport;
