import React, { useEffect, useState } from 'react';
import { Tabs, Table, Typography, Card, DatePicker, Select } from 'antd';
import CashFlowReport from './CashFlowReport';
import ProfitLossReport from './ProfitLossReport';

import * as SaldoKeuanganAxios from '@pages/keuangan/saldo-keuangan/service/SaldoKeuanganAxios';
import * as SaldoKeuanganInterfaces from '@pages/keuangan/saldo-keuangan/interface/SaldoKeuanganInterfaces';
import { Book, User } from '@phosphor-icons/react';
import { currencyFormatter, titleCase } from '@/utils/helper';
import { showNotification } from '@/contexts/services/notificationService';
import * as globalHelpers from '@/utils/helper';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import * as globalHooks from '@/hooks';
// import FinancialStatements from './FinancialStatements';
import dayjs, { Dayjs } from 'dayjs';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const { Title } = Typography;
const FinancialStatementTabs: React.FC = () => {
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    unitId: '',
  });
  const [periode, setPeriode] = useState<[Dayjs, Dayjs] | null>([
    dayjs(`${dayjs().year()}-01-01`), // 1 Januari tahun ini
    dayjs(), // hari ini
  ]);

  const [data, setData] = useState<{
    loading: boolean;
    data: SaldoKeuanganInterfaces.BalanceSheetType | null | any;
  }>({
    loading: false,
    data: null,
  });
  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);

  const renderTable = (
    title: string,
    items: SaldoKeuanganInterfaces.AssetType[],
    typeNeraca: string,
    typeNeraca2: string,
    i: number
  ) => (
    <>
      <Card
        title={title}
        style={
          items.filter((item) => item.typeNeraca === typeNeraca || item.typeNeraca === typeNeraca2)
            .length <= 0
            ? { display: 'none' }
            : { marginBottom: 16 }
        }
        extra={
          i === 0 && (
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
                onChange={(value) => setPeriode(value as any)}
                defaultValue={[
                  dayjs(`${dayjs().year()}-01-01`), // 1 Januari tahun ini
                  dayjs(), // Hari ini
                ]}
                format={dateFormat}
              />
            </div>
          )
        }
      >
        <Table
          dataSource={items.filter(
            (item) => item.typeNeraca === typeNeraca || item.typeNeraca === typeNeraca2
          )}
          columns={[
            { title: 'Kode Akun', dataIndex: 'code', key: 'code' },
            { title: 'Nama Akun', dataIndex: 'name', key: 'name' },
            {
              title: 'Saldo',
              dataIndex: 'balance',
              key: 'balance',
              align: 'right',
              render: (value: number) => currencyFormatter(value || 0),
            },
          ]}
          rowKey="code"
          pagination={false}
        />
      </Card>

      {'LABARUGI' === typeNeraca && (
        <Card
          title={`BEBAN PENJUALAN`}
          style={
            items.filter((item) => item.typeNeraca === 'LABARUGI-BEBAN-POKOK-PENJUALAN').length <= 0
              ? { display: 'none' }
              : { marginBottom: 16 }
          }
        >
          <Table
            dataSource={items.filter(
              (item) => item.typeNeraca === 'LABARUGI-BEBAN-POKOK-PENJUALAN'
            )}
            columns={[
              { title: 'Kode Akun', dataIndex: 'code', key: 'code' },
              { title: 'Nama Akun', dataIndex: 'name', key: 'name' },
              {
                title: 'Saldo',
                dataIndex: 'balance',
                key: 'balance',
                align: 'right',
                render: (value: number) => currencyFormatter(value || 0),
              },
            ]}
            rowKey="code"
            pagination={false}
          />
        </Card>
      )}

      {'LABARUGI' === typeNeraca && (
        <Card
          title={`PAJAK`}
          style={
            items.filter((item) => item.typeNeraca === 'LABARUGI-PAJAK').length <= 0
              ? { display: 'none' }
              : { marginBottom: 16 }
          }
          extra={
            i === 0 && (
              <RangePicker
                style={{
                  height: 40,
                }}
                onChange={(value) => setPeriode(value as any)}
                defaultValue={[
                  dayjs(`${dayjs().year()}-01-01`), // 1 Januari tahun ini
                  dayjs(), // Hari ini
                ]}
                format={dateFormat}
              />
            )
          }
        >
          <Table
            dataSource={items.filter((item) => item.typeNeraca === 'LABARUGI-PAJAK')}
            columns={[
              { title: 'Kode Akun', dataIndex: 'code', key: 'code' },
              { title: 'Nama Akun', dataIndex: 'name', key: 'name' },
              {
                title: 'Saldo',
                dataIndex: 'balance',
                key: 'balance',
                align: 'right',
                render: (value: number) => currencyFormatter(value || 0),
              },
            ]}
            rowKey="code"
            pagination={false}
          />
        </Card>
      )}
    </>
  );

  useEffect(() => {
    fetchDataBalanceSheet();
  }, [periode, unit.unitId]);

  const fetchDataBalanceSheet = async () => {
    try {
      const startDate = periode?.[0]?.format('YYYY-MM-DD');
      const endDate = periode?.[1]?.format('YYYY-MM-DD');

      if (startDate && endDate) {
        const data = await SaldoKeuanganAxios.fetchBalanceSheet(startDate, endDate, unit.unitId);
        setData((prev) => ({ ...prev, data: data }));
      }
    } catch (e) {
      setData((prev) => ({ ...prev, loading: false }));
      showNotification('error', 'Gagal', 'Terjadi Kesalahan');
    }
  };
  return (
    <div style={{ padding: 24 }}>
      <Title
        level={3}
        style={{
          display: 'flex',
          gap: 5,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Book /> Laporan Keuangan
        </div>
      </Title>

      <Tabs defaultActiveKey="neraca" type="card">
        <Tabs.TabPane tab="🧾 Neraca" key="neraca">
          {Object.keys(data?.data || {}).map((item, i) => {
            return renderTable(
              titleCase(item),
              data?.data?.[item] || [],
              'NERACA',
              'LABARUGI-NERACA',
              i
            );
          })}
        </Tabs.TabPane>
        <Tabs.TabPane tab="📈 Laba Rugi" key="laba_rugi">
          {Object.keys(data?.data || {}).map((item, i) => {
            return renderTable(
              titleCase(item),
              data?.data?.[item] || [],
              'LABARUGI',
              'LABARUGI-NERACA',
              i
            );
          })}
        </Tabs.TabPane>

        <Tabs.TabPane tab="📈 Laporan Arus Kas" key="arus_kas">
          <CashFlowReport />
        </Tabs.TabPane>

        <Tabs.TabPane tab="📈 Laporan Laba Rugi" key="lana_rugi">
          <ProfitLossReport />
        </Tabs.TabPane>

        {/* <Tabs.TabPane tab="📈 Consoolidasi" key="consolidasi">
          <FinancialStatements />
        </Tabs.TabPane> */}
      </Tabs>
    </div>
  );
};

export default FinancialStatementTabs;
