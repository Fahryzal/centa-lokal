import React from 'react';
import { Card, DatePicker, Select, Table, Typography } from 'antd';
import TitleCardDetail from '@/components/atoms/Cards/titleCardDetail';
import { FilePdf } from '@phosphor-icons/react';
import { ButtonFile } from '@/components/atoms/button/buttonCardGroups';
import { exportTrialBalanceToPDF } from '@/utils/generatePdf/exportTrialBalanceToPDF';
import { FileExcelOutlined } from '@ant-design/icons';
import { exportTrialBalanceToExcel } from '@/utils/generateExcel/TrialBalance/exportTrialBalanceToExcel';
import * as helperGlobal from '@/utils/helper';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/id';

const { Title } = Typography;
const monthFormat = 'YYYY/MM';

interface Amount {
  debit: number;
  credit: number;
}

interface TrialBalanceRow {
  accountCode: string;
  accountName: string;
  neracaAwal: Amount;
  saldoAwal: Amount;
  mutasi: Amount;
  saldoAkhir: Amount;
}

interface Props {
  data: TrialBalanceRow[];
  period: Dayjs; // e.g. '2025-04'
  setUnit: React.Dispatch<React.SetStateAction<any>>;
  onSearchUnit: any;
  unit: any;
  setPeriode: React.Dispatch<React.SetStateAction<Dayjs>>;
  periode: Dayjs;
}

const TrialBalanceTable: React.FC<Props> = ({
  data,
  periode,
  setUnit,
  onSearchUnit,
  unit,
  setPeriode,
}) => {
  const columns: any = [
    {
      title: 'Kode Rekening',
      dataIndex: 'accountCode',
      fixed: 'left',
      width: 130,
    },
    {
      title: 'Nama Rekening',
      dataIndex: 'accountName',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Neraca Awal',
      children: [
        {
          title: 'Debet',
          dataIndex: ['neracaAwal', 'debit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
        {
          title: 'Kredit',
          dataIndex: ['neracaAwal', 'credit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
      ],
    },
    {
      title: 'Saldo Awal',
      children: [
        {
          title: 'Debet',
          dataIndex: ['saldoAwal', 'debit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
        {
          title: 'Kredit',
          dataIndex: ['saldoAwal', 'credit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
      ],
    },
    {
      title: 'Mutasi',
      children: [
        {
          title: 'Debet',
          dataIndex: ['mutasi', 'debit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
        {
          title: 'Kredit',
          dataIndex: ['mutasi', 'credit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
      ],
    },
    {
      title: 'Saldo Akhir',
      children: [
        {
          title: 'Debet',
          dataIndex: ['saldoAkhir', 'debit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
        {
          title: 'Kredit',
          dataIndex: ['saldoAkhir', 'credit'],
          render: (v: number) => v.toLocaleString(),
          align: 'right',
        },
      ],
    },
  ];

  return (
    <Card
      title={<TitleCardDetail title="Trial Balance" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={
        <div style={{ display: 'flex', gap: 5 }}>
          <DatePicker
            defaultValue={dayjs()}
            format={monthFormat}
            picker="month"
            onChange={(value) => setPeriode(value)}
          />
          <Select
            showSearch
            allowClear
            style={{ width: 200 }}
            placeholder="Pilih Unit"
            onChange={(val) =>
              setUnit((prev: any) => ({
                ...prev,
                unitId: val.split('$')[0],
                nama: val.split('$')[1],
              }))
            }
            onSearch={onSearchUnit}
            value={`${unit.unitId}$${unit.nama}`}
            options={helperGlobal.toAntdOptions(unit.data || [], 'id', 'nama')}
          />

          <ButtonFile
            color="blue"
            icon={<FilePdf />}
            text="Trial Balance"
            onClick={() =>
              exportTrialBalanceToPDF(
                data,
                unit.nama?.toUpperCase(),
                dayjs(periode).format('YYYY-MM')
              )
            }
          />

          <ButtonFile
            color="geekblue"
            icon={<FileExcelOutlined />}
            text="Trial Balance"
            onClick={() =>
              exportTrialBalanceToExcel(
                data,
                unit.nama?.toUpperCase(),
                dayjs(periode).format('YYYY-MM')
              )
            }
          />
        </div>
      }
    >
      <Title level={4} style={{ textAlign: 'center' }}>
        PT. INDUSTRI KARET NUSANTARA
      </Title>
      <Title level={5} style={{ textAlign: 'center' }}>
        NERACA PERCOBAAN — {unit.nama?.toUpperCase()}
      </Title>
      <Title level={5} style={{ textAlign: 'center', marginBottom: 20 }}>
        BULAN BUKU: {dayjs(periode).format('YYYY-MM')}
      </Title>

      <Table
        dataSource={data}
        columns={columns}
        rowKey={(row) => row.accountCode}
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
        size="small"
      />
    </Card>
  );
};

export default TrialBalanceTable;
