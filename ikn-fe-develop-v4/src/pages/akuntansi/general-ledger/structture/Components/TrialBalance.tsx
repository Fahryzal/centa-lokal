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
import { memo, useEffect } from 'react';
import Loading from '@/components/atoms/Loading/Loading';
const monthFormat = 'YYYY/MM';
const { Title } = Typography;
const dataUser = helperGlobal.decodeJwt();
const isRoot = dataUser?.isRoot === 'Y';
const unitId = dataUser?.unitId;
const isPusat = dataUser?.isPusat;

const columns = [
  { title: 'Kode Akun', dataIndex: 'accountCode', key: 'accountCode', width: 150 },
  { title: 'Nama Akun', dataIndex: 'accountName', key: 'accountName', width: 200 },
  {
    title: 'Neraca Awal Debit',
    dataIndex: ['neracaAwal', 'debit'],
    key: 'neracaAwalDebit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
  {
    title: 'Neraca Awal Credit',
    dataIndex: ['neracaAwal', 'credit'],
    key: 'neracaAwalCredit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
  {
    title: 'Saldo Awal Debit',
    dataIndex: ['saldoAwal', 'debit'],
    key: 'saldoAwalDebit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
  {
    title: 'Saldo Awal Credit',
    dataIndex: ['saldoAwal', 'credit'],
    key: 'saldoAwalCredit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
  {
    title: 'Mutasi Debit',
    dataIndex: ['mutasi', 'debit'],
    key: 'mutasiDebit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
  {
    title: 'Mutasi Credit',
    dataIndex: ['mutasi', 'credit'],
    key: 'mutasiCredit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
  {
    title: 'Saldo Akhir Debit',
    dataIndex: ['saldoAkhir', 'debit'],
    key: 'saldoAkhirDebit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
  {
    title: 'Saldo Akhir Credit',
    dataIndex: ['saldoAkhir', 'credit'],
    key: 'saldoAkhirCredit',
    align: 'right',
    render: (value: number) => helperGlobal.currencyFormatterUS(value || 0),
  },
];

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
  setUnit: React.Dispatch<React.SetStateAction<any>>;
  onSearchUnit: any;
  unit: any;
  setPeriode: React.Dispatch<React.SetStateAction<Dayjs>>;
  periode: Dayjs;
  maxPeriode: string;
  loading: boolean;
}

const TrialBalanceComponent: React.FC<Props> = ({
  data,
  periode,
  setUnit,
  onSearchUnit,
  unit,
  setPeriode,
  maxPeriode,
  loading,
}) => {
  // hitung total keseluruhan sekali saja
  const grand = {
    neracaAwal: { debit: 0, credit: 0 },
    saldoAwal: { debit: 0, credit: 0 },
    mutasi: { debit: 0, credit: 0 },
    saldoAkhir: { debit: 0, credit: 0 },
  };

  data.forEach((group: any) => {
    group.accounts.forEach(({ neracaAwal, saldoAwal, mutasi, saldoAkhir }: any) => {
      grand.neracaAwal.debit += neracaAwal.debit;
      grand.neracaAwal.credit += neracaAwal.credit;
      grand.saldoAwal.debit += saldoAwal.debit;
      grand.saldoAwal.credit += saldoAwal.credit;
      grand.mutasi.debit += mutasi.debit;
      grand.mutasi.credit += mutasi.credit;
      grand.saldoAkhir.debit += saldoAkhir.debit;
      grand.saldoAkhir.credit += saldoAkhir.credit;
    });
  });

  const dataOptions = helperGlobal
    .toAntdOptions(unit.data.concat([{ id: null, nama: 'Semua' }]) || [], 'id', 'nama')
    .find((item: any) => item.value.includes(unitId));

  useEffect(() => {
    setUnit((prev: any) => ({
      ...prev,
      dataUnit: [{ id: unitId, nama: '' }],
    }));
  }, [unitId]);

  return (
    <Card
      title={<TitleCardDetail title="Trial Balance" />}
      style={{ boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
      extra={
        <div style={{ display: 'flex', gap: 5 }}>
          <DatePicker
            key={periode as any}
            defaultValue={dayjs(periode, 'YYYY-MM')}
            format={monthFormat}
            picker="month"
            onChange={(value) => setPeriode(value)}
            disabledDate={(current) => {
              if (!current) return false;
              return current > dayjs(maxPeriode, 'YYYY-MM').endOf('month');
            }}
          />
          <Select
            showSearch
            allowClear
            mode="multiple"
            key={dataOptions?.value}
            defaultValue={`${dataOptions?.value}` as any}
            disabled={!isRoot || !isPusat}
            style={{ width: 250 }}
            placeholder="Pilih Unit"
            onChange={(vals: string[]) => {
              const selectedUnits = vals.map((val) => {
                const [unitId, nama] = val.split('$');
                return { id: unitId, nama };
              });
              setUnit((prev: any) => ({
                ...prev,
                dataUnit: selectedUnits,
              }));
            }}
            onSearch={onSearchUnit}
            // value={unit.map((u: any) => `${u.id}$${u.nama}`)} // multiple -> array of string
            options={helperGlobal.toAntdOptions(
              unit.data.concat([{ id: null, nama: 'Semua' }]) || [],
              'id',
              'nama'
            )}
          />

          <ButtonFile
            color="blue"
            icon={<FilePdf />}
            text="Trial Balance"
            onClick={() =>
              exportTrialBalanceToPDF(
                data as any,
                unit.dataUnit?.map((unit: any) => unit.nama?.toUpperCase()).join(', '),
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
                unit.dataUnit?.map((unit: any) => unit.nama?.toUpperCase()).join(', '),
                dayjs(periode).format('YYYY-MM')
              )
            }
          />
        </div>
      }
    >
      {loading && <Loading />}
      {!loading && (
        <>
          <Title level={4} style={{ textAlign: 'center' }}>
            PT. INDUSTRI KARET NUSANTARA
          </Title>
          <Title level={5} style={{ textAlign: 'center' }}>
            NERACA PERCOBAAN —{' '}
            {unit.dataUnit?.map((unit: any) => unit.nama?.toUpperCase()).join(', ')}
          </Title>
          <Title level={5} style={{ textAlign: 'center', marginBottom: 20 }}>
            BULAN BUKU: {dayjs(periode).format('YYYY-MM')}
          </Title>

          <div style={{ overflowX: 'auto' }}>
            {data.map((group: any, idx: number) => (
              <Table
                style={{ position: 'relative', zIndex: 10, marginBottom: 24, minWidth: 1600 }}
                key={Math.random()}
                columns={columns as any}
                dataSource={group.accounts}
                rowKey="accountCode"
                tableLayout="fixed"
                scroll={{ x: 1600 }}
                pagination={false}
                bordered
                summary={(pageData) => {
                  let totalNeracaAwalDebit = 0;
                  let totalNeracaAwalCredit = 0;
                  let totalSaldoAwalDebit = 0;
                  let totalSaldoAwalCredit = 0;
                  let totalMutasiDebit = 0;
                  let totalMutasiCredit = 0;
                  let totalSaldoAkhirDebit = 0;
                  let totalSaldoAkhirCredit = 0;

                  pageData.forEach(({ neracaAwal, saldoAwal, mutasi, saldoAkhir }: any) => {
                    totalNeracaAwalDebit += neracaAwal.debit;
                    totalNeracaAwalCredit += neracaAwal.credit;
                    totalSaldoAwalDebit += saldoAwal.debit;
                    totalSaldoAwalCredit += saldoAwal.credit;
                    totalMutasiDebit += mutasi.debit;
                    totalMutasiCredit += mutasi.credit;
                    totalSaldoAkhirDebit += saldoAkhir.debit;
                    totalSaldoAkhirCredit += saldoAkhir.credit;
                  });

                  return (
                    <>
                      <Table.Summary.Row style={{ backgroundColor: '#154D71', color: 'white' }}>
                        <Table.Summary.Cell index={0} colSpan={2}>
                          <b>Subtotal</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} align="right">
                          {helperGlobal.currencyFormatterUS(totalNeracaAwalDebit || 0)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3} align="right">
                          {helperGlobal.currencyFormatterUS(totalNeracaAwalCredit || 0)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4} align="right">
                          {helperGlobal.currencyFormatterUS(totalSaldoAwalDebit || 0)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={5} align="right">
                          {helperGlobal.currencyFormatterUS(totalSaldoAwalCredit || 0)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={6} align="right">
                          {helperGlobal.currencyFormatterUS(totalMutasiDebit || 0)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={7} align="right">
                          {helperGlobal.currencyFormatterUS(totalMutasiCredit || 0)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={8} align="right">
                          {helperGlobal.currencyFormatterUS(totalSaldoAkhirDebit || 0)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={9} align="right">
                          {helperGlobal.currencyFormatterUS(totalSaldoAkhirCredit || 0)}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>

                      {idx === data?.length - 1 && (
                        <Table.Summary.Row
                          style={{
                            backgroundColor: '#1C6EA4',
                            color: 'white',
                          }}
                        >
                          <Table.Summary.Cell index={0} colSpan={2}>
                            <b>Grand Total</b>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} align="right">
                            {helperGlobal.currencyFormatterUS(grand.neracaAwal.debit || 0)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3} align="right">
                            {helperGlobal.currencyFormatterUS(grand.neracaAwal.credit || 0)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4} align="right">
                            {helperGlobal.currencyFormatterUS(grand.saldoAwal.debit || 0)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={5} align="right">
                            {helperGlobal.currencyFormatterUS(grand.saldoAwal.credit || 0)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={6} align="right">
                            {helperGlobal.currencyFormatterUS(grand.mutasi.debit || 0)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={7} align="right">
                            {helperGlobal.currencyFormatterUS(grand.mutasi.credit || 0)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={8} align="right">
                            {helperGlobal.currencyFormatterUS(grand.saldoAkhir.debit || 0)}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={9} align="right">
                            {helperGlobal.currencyFormatterUS(grand.saldoAkhir.credit || 0)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                    </>
                  );
                }}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export const TrialBalance = memo(TrialBalanceComponent);
