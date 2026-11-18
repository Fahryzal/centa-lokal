import React, { useMemo } from 'react';
import { Table } from 'antd';
import { currencyFormatter } from '@/utils/helper';
import { Card, Pagination } from 'antd';
import { extractCode, getPrefix } from '@/utils/func/func';

interface JournalItem {
  referenceNumber: string;
  numberJurnal: string;
  journalId: string;
  date: string;
  description: string;
  accountCode: string;
  accountName: string;
  debit: string;
  credit: string;
  kodeAccount: string;
  unit: {
    kode: string;
    nama: string;
  };
  transaction: {
    id: string;
    documentCode: string;
    referenceNumber: string;
    documentNo: string;
    faktur: string;
    date: string;
    unit: {
      kode: string;
      nama: string;
    };
    items: {
      id: string;
      masterRawMaterialId: string;
      nilaiSatuan: number;
      quantity: number;
      satuan: string;
      Total: number;
    }[];
    supplier: {
      id: string;
      namaRekanan: string;
      nomorPengenal: string;
    };
  };
}

interface Props {
  data: JournalItem[];
  dataTable: any;
  setTable: any;
}

const formatFisik = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '-';
  }

  return Number(number.toFixed(2)).toString();
};

const JournalTable: React.FC<Props> = ({ setTable, dataTable, data }) => {
  const columns = [
    { title: 'KO_BKT', dataIndex: 'KO_BKT', key: 'KO_BKT' },
    { title: 'NMR_BKT', dataIndex: 'NMR_BKT', key: 'NMR_BKT' },
    { title: 'TANGGAL', dataIndex: 'TANGGAL', key: 'TANGGAL' },
    { title: 'KO_REKG', dataIndex: 'KO_REKG', key: 'KO_REKG' },
    { title: 'Nama REKG', dataIndex: 'Nama_REKG', key: 'Nama_REKG' },
    { title: 'DBT_KRD', dataIndex: 'DBT_KRD', key: 'DBT_KRD' },
    { title: 'NKB', dataIndex: 'NKB', key: 'NKB' },
    { title: 'FISIK', dataIndex: 'FISIK', key: 'FISIK' },
    { title: 'SBRG', dataIndex: 'SBRG', key: 'SBRG' },
    { title: 'REKLA', dataIndex: 'REKLA', key: 'REKLA' },
    { title: 'RPH', dataIndex: 'RPH', key: 'RPH' },
    { title: 'KETERANGAN', dataIndex: 'KETERANGAN', key: 'KETERANGAN' },
    { title: 'KO_KEB', dataIndex: 'KO_KEB', key: 'KO_KEB' },
    { title: 'KO_BUD', dataIndex: 'KO_BUD', key: 'KO_BUD' },
    { title: 'KD_IMPORT', dataIndex: 'KD_IMPORT', key: 'KD_IMPORT' },
  ];

  const mappedData = useMemo(
    () =>
      data.map((item: any, index) => {
        const trx = item.transaction;
        const firstItem = trx?.items[0];
        const fisikValue =
          item.fisikWarehouseIssue ||
          item.fisikWarehouseReceipt ||
          (Number(item.debit) > 0
            ? firstItem?.quantity || Number(item.creditDollar) || Number(item.debitDollar)
            : Number(item.creditDollar) || Number(item.debitDollar));

        const fisikFormatted = formatFisik(fisikValue);
        if (item.transaction?.documentCode) {
          return {
            key: index,
            KO_BKT: getPrefix(item.transaction?.documentNo || ''),
            NMR_BKT: extractCode(item.transaction?.documentNo) || '-',
            TANGGAL: new Date(item.date).toLocaleDateString('id-ID'),
            KO_REKG: item.kodeAccount,
            Nama_REKG: item.accountName,
            DBT_KRD: Number(item.debit) > 0 ? 'D' : 'K',
            NKB: '',
            FISIK: fisikFormatted,
            SBRG: Number(item.debit) > 0 ? firstItem?.satuan : '-',
            REKLA: '',
            RPH: firstItem?.Total.toLocaleString('id-ID'),
            KETERANGAN: item.description,
            KO_KEB: item.transaction?.unit.nama, // contoh default
            KO_BUD: '', // bisa isi kode anggaran
            KD_IMPORT: 'INV', // misal pakai faktur
          };
        } else {
          return {
            key: index,
            KO_BKT: getPrefix(item?.referenceNumber || ''),
            NMR_BKT: extractCode(item?.referenceNumber) || '-',
            TANGGAL: new Date(item.date).toLocaleDateString('id-ID'),
            KO_REKG: item.kodeAccount,
            Nama_REKG: item.accountName,
            DBT_KRD: Number(item.debit) > 0 ? 'D' : 'K',
            NKB: '-',
            FISIK: fisikFormatted,
            SBRG: '-',
            REKLA: '-',
            RPH:
              Number(item.debit) > 0
                ? currencyFormatter(Number(item.debit))
                : currencyFormatter(Number(item.credit)),
            RPH_1: '',
            KETERANGAN: item.description,
            KETER_2: '',
            KO_KEB: item.unit.nama, // contoh default
            KO_BUD: '', // bisa isi kode anggaran
            KD_IMPORT: 'TRAN', // misal pakai faktur
          };
        }
      }),
    [data]
  );

  return (
    <>
      <Table
        pagination={false}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={mappedData}
        bordered
        size="small"
      />
      <Card
        style={{
          backgroundColor: 'white',
          padding: 0,
          textAlign: 'center',
          marginTop: 10,
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Pagination
          showLessItems
          key={dataTable.page}
          defaultCurrent={dataTable.page}
          total={dataTable.total}
          defaultPageSize={dataTable.limit}
          showSizeChanger={false}
          showQuickJumper
          onChange={(page) => {
            setTable((prev: any) => ({ ...prev, page: page }));
          }}
        />
      </Card>
    </>
  );
};

export default JournalTable;
