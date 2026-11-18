import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Select, Table, Tag, Tooltip, Typography } from 'antd';
import 'dayjs/locale/id';
import * as SaldoKeuanganAxios from '@pages/keuangan/saldo-keuangan/service/SaldoKeuanganAxios';
import * as SaldoKeuanganInterfaces from '@pages/keuangan/saldo-keuangan/interface/SaldoKeuanganInterfaces';
import { terbilangRupiah } from '@/utils/helper';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Book, User } from '@phosphor-icons/react';
import { showNotification } from '@/contexts/services/notificationService';
import * as globalHelpers from '@/utils/helper';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import * as globalHooks from '@/hooks';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
dayjs.locale('id');
const { Title } = Typography;
const CashFlowReport: React.FC = () => {
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    unitId: '',
  });
  const [data, setData] = useState<{
    loading: boolean;
    data: SaldoKeuanganInterfaces.SaldoKeuanganType | null;
  }>({
    data: null,
    loading: false,
  });
  const formatCurrency = (amount: number) => `Rp${amount?.toLocaleString('id-ID')}`;

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD MMMM YYYY HH:mm'),
    },
    {
      title: 'Akun',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Jumlah',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (value: number, record: any) => (
        <Tooltip title={terbilangRupiah(value || 0)}>
          <span style={{ color: record.type === 'CASH_IN' ? 'green' : 'red' }}>
            {formatCurrency(value || 0)}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) =>
        type === 'CASH_IN' ? <Tag color="green">Masuk</Tag> : <Tag color="red">Keluar</Tag>,
    },
  ];

  useEffect(() => {
    const startDate = dayjs(`${dayjs().year()}-01-01`); // 1 Januari tahun ini
    const endDate = dayjs(); // Hari ini

    fetchDataCashFLow(startDate, endDate);
  }, [unit.unitId]);

  const fetchDataCashFLow = async (startDate: Dayjs, endDate: Dayjs) => {
    try {
      const data = await SaldoKeuanganAxios.fetchCashFLow(startDate, endDate, unit.unitId);
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
      fetchDataCashFLow(startDate, endDate);
    } else {
      showNotification('warning', 'Peringatan', 'Tanggal kosong atau tidak lengkap');
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
        <Title
          level={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            textDecoration: 'underline',
          }}
        >
          <Book /> Laporan Arus Kas
        </Title>
        <div
          style={{
            display: 'flex',
            gap: 5,
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

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card title="Total Masuk" bordered>
            <Tooltip title={terbilangRupiah(data?.data?.totalIn as number)}>
              <Title level={4} style={{ color: 'green' }}>
                {formatCurrency(data?.data?.totalIn as number)}
              </Title>
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Keluar" bordered>
            <Tooltip title={terbilangRupiah(data.data?.totalOut as number)}>
              <Title level={4} style={{ color: 'red' }}>
                {formatCurrency(data.data?.totalOut as number)}
              </Title>
            </Tooltip>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Arus Kas Bersih" bordered>
            <Tooltip title={terbilangRupiah(data.data?.netCashFlow as number)}>
              <Title level={4}>{formatCurrency(data.data?.netCashFlow as number)}</Title>
            </Tooltip>
          </Card>
        </Col>
      </Row>

      <Card title="Detail Transaksi">
        <Table
          columns={columns}
          dataSource={data.data?.items}
          rowKey={(record) => `${record.date}-${record.accountName}-${record.amount}`}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default CashFlowReport;
