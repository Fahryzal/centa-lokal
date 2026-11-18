import React, { useEffect, useState } from 'react';
import { Button, Card, DatePicker, Descriptions, Form, Input, Select, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import * as helperGlobal from '@/utils/helper';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/id';
import * as AccountInterfaces from '@pages/master/account-index/account/interface/AccountInterfaces';
import * as BukuBesaraxios from '@/pages/akuntansi/buku-rekening/services/BukuBesaraxios';
import { showNotification } from '@/contexts/services/notificationService';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import generateLedgerPDF from '@/utils/generatePdf/bukuRekening';
import TitleCardItems from '@/components/atoms/Cards/Items/titleCardItems';
import { exportBukuRekeningToExcel } from '@/utils/generateExcel/Gudang/exportBukuRekeningToExcel';
import { FileExcelOutlined, SearchOutlined } from '@ant-design/icons';
import { TagChevron, User } from '@phosphor-icons/react';
import ModalAccount from '@/components/ModalAccount/ModalAccount';
import * as globalHelpers from '@/utils/helper';
import * as BarangJadiAxios from '@pages/gudang/barang-jadi/service/BarangJadiAxios';
import * as globalHooks from '@/hooks';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

interface BukuBesarRow {
  tanggal: string;
  noJurnal: string;
  keterangan: string;
  debit: number;
  kredit: number;
  saldo: number;
}

const columns: ColumnsType<BukuBesarRow> = [
  {
    title: 'Tanggal',
    dataIndex: 'tanggal',
    key: 'tanggal',
    render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
  },
  {
    title: 'No Transaksi',

    dataIndex: 'noTransaksi',
    key: 'noTransaksi',
    render: (text: string) => <span>{text || '-'}</span>,
  },
  {
    title: 'Keterangan',
    dataIndex: 'keterangan',
    key: 'keterangan',
  },
  {
    title: 'Fisik',
    dataIndex: 'fisik',
    key: 'fisik',
    render: (_text: string, item: any) => (
      <span>
        {helperGlobal.formatter(
          Number(
            item.fisikWarehouseIssue ||
              item.fisikWarehouseReceipt ||
              item.fisikCreditDollar ||
              item.fisikDebitDollar ||
              0
          )
        )}
      </span>
    ),
  },
  {
    title: 'Debit',
    dataIndex: 'debit',
    key: 'debit',
    render: (value: number) => <span>Rp. {helperGlobal.currencyFormatter(value)}</span>,
  },
  {
    title: 'Kredit',
    dataIndex: 'kredit',
    key: 'kredit',
    render: (value: number) => <span>Rp. {helperGlobal.currencyFormatter(value)}</span>,
  },
  {
    title: 'Saldo',
    dataIndex: 'saldo',
    key: 'saldo',
    render: (value: number) => <span>Rp. {helperGlobal.currencyFormatter(value)}</span>,
  },
];

const BukuRekening: React.FC = () => {
  const [periode, setPeriode] = useState<[Dayjs, Dayjs] | null>([
    dayjs(`${dayjs().year()}-01-01`), // 1 Januari tahun ini
    dayjs(), // hari ini
  ]);
  const [data, setData] = useState<any>([]);
  const [accountCode, setAccountCode] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [unit, setUnit] = useState({
    data: [],
    page: 1,
    limit: 5,
    loading: false,
    nama: '',
    unitId: '',
  });

  const handleChange = (value: any) => {
    setAccountCode(value);
  };

  useEffect(() => {
    const startDate = periode?.[0]?.format('YYYY-MM-DD');
    const endDate = periode?.[1]?.format('YYYY-MM-DD');
    if (accountCode && startDate && endDate) {
      fetchDataTrialBalance(accountCode, startDate, endDate, unit.unitId);
    }
  }, [
    accountCode,
    periode?.[0]?.format('YYYY-MM-DD'),
    periode?.[1]?.format('YYYY-MM-DD'),
    unit.unitId,
  ]);

  const fetchDataTrialBalance = async (
    accountCode: string,
    startDate: string,
    endDate: string,
    unitId: string
  ) => {
    try {
      const data = await BukuBesaraxios.fetchDataBukuBesar(accountCode, startDate, endDate, unitId);
      setData(data);
    } catch (e) {
      showNotification('error', 'Gagal', 'gagal mendapatkan data');
    }
  };

  const handleRowDoubleClick = async (record: AccountInterfaces.AccountType) => {
    handleChange(record.code);
    form.setFieldValue('accountName', record.name);
    setOpen(false);
  };

  globalHooks.useFetchOptions(unit, setUnit, BarangJadiAxios.fetchDataUnit, [unit.nama]);
  return (
    <>
      <ModalAccount open={open} setOpen={setOpen} handleRowDoubleClick={handleRowDoubleClick} />
      <Card
        title={<TitleCardItems title="Buku Rekening" />}
        extra={
          <Form
            form={form}
            layout="vertical"
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: '100%' }}
          >
            <div style={{ display: 'flex', gap: 5 }}>
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
                  height: 40,
                }}
                onChange={(value) => setPeriode(value as any)}
                defaultValue={[
                  dayjs(`${dayjs().year()}-01-01`), // 1 Januari tahun ini
                  dayjs(), // Hari ini
                ]}
                format={dateFormat}
              />

              <Form.Item
                name="accountName"
                style={{ width: 'auto', minWidth: 200 }}
                rules={[{ required: false, message: 'Masukan Nama Akun!' }]}
              >
                <Input disabled prefix={<TagChevron size={16} />} placeholder="Nama Akun" />
              </Form.Item>

              <Tooltip title="search">
                <Button
                  type="primary"
                  onClick={() => setOpen(true)}
                  shape="circle"
                  icon={<SearchOutlined />}
                />
              </Tooltip>

              <ButtonFile onClick={() => generateLedgerPDF({ ...data, accountCode, periode })} />
              <ButtonFile
                text="Download Excel"
                icon={<FileExcelOutlined />}
                onClick={() => exportBukuRekeningToExcel({ ...data, periode })}
              />
            </div>
          </Form>
        }
      >
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 10 }}>
          <Descriptions.Item label="COA">{data?.code || '-'}</Descriptions.Item>
          <Descriptions.Item label="Nama Akun">{data?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Saldo Awal Debit">
            Rp.{helperGlobal.currencyFormatter(data?.totalDebitAwal || 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Saldo Awal Credit">
            Rp.{helperGlobal.currencyFormatter(data?.totalCreditAwal || 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Mutasi Debit">
            Rp.{helperGlobal.currencyFormatter(data?.sumDebit || 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Mutasi Credit">
            Rp.{helperGlobal.currencyFormatter(data?.sumCredit || 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Saldo Akhir Debit">
            Rp.{helperGlobal.currencyFormatter(data?.sumAllDebit || 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Saldo Akhir Credit">
            Rp.{helperGlobal.currencyFormatter(data?.sumAllCredit || 0)}
          </Descriptions.Item>
        </Descriptions>

        <Table
          columns={columns}
          scroll={{ x: 'max-content' }}
          dataSource={data?.bukuBesar || []}
          rowKey="noJurnal"
          pagination={false}
          bordered
          // footer={() => (
          //   <>
          //     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          //       Total
          //       <div style={{ width: '100%', textAlign: 'right' }}>
          //         <span style={{ marginRight: 50 }}>
          //           Rp.{helperGlobal.currencyFormatter(data?.totalSaldoDebit || 0)}
          //         </span>
          //         <span style={{ marginRight: 125 }}>
          //           Rp.{helperGlobal.currencyFormatter(data?.totalSaldoCredit || 0)}
          //         </span>
          //       </div>
          //     </div>
          //   </>
          // )}
        />
      </Card>
    </>
  );
};

export default BukuRekening;
