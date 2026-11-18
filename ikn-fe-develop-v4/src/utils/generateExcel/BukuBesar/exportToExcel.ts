import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { currencyFormatter } from '@/utils/helper';
import { extractCode, getPrefix } from '@/utils/func/func';

const exportToExcel = (mappedData: any, periode: string) => {
  const headers = [
    'KO_BKT',
    'NMR_BKT',
    'TANGGAL',
    'KO_REKG',
    'Nama REKG',
    'DBT_KRD',
    'NKB',
    'FISIK',
    'SBRG',
    'REKLA',
    'RPH',
    'KETER',
    'KO_KEB',
    'KO_BUD',
    'KD_IMPORT',
  ];

  // mapping ke object dulu
  const rowObjects = mappedData.map((item: any, _index: number) => {
    const trx = item.transaction;
    const firstItem = trx?.items?.[0];

    if (item.transaction?.documentCode) {
      return {
        KO_BKT: getPrefix(item?.referenceNumber || getPrefix(trx?.documentNo) || ''),
        NMR_BKT: extractCode(trx.documentNo) || '-',
        TANGGAL: new Date(item.date).toLocaleDateString('id-ID'),
        KO_REKG: item.kodeAccount,
        Nama_REKG: item.accountName,
        DBT_KRD: Number(item.debit) > 0 ? 'D' : 'K',
        NKB: '',
        FISIK:
          item.fisikWarehouseIssue ||
          item.fisikWarehouseReceipt ||
          (Number(item.debit) > 0
            ? firstItem?.quantity ||
              firstItem?.quantity ||
              Number(item.creditDollar) ||
              Number(item.debitDollar)
            : Number(item.creditDollar) || Number(item.debitDollar)),
        SBRG: Number(item.debit) > 0 ? firstItem?.satuan : '-',
        REKLA: '',
        RPH: firstItem?.Total.toLocaleString('id-ID'),
        KETER: item.description,
        KO_KEB: trx?.unit?.nama || '',
        KO_BUD: '',
        KD_IMPORT: 'INV',
      };
    } else {
      return {
        KO_BKT: getPrefix(item?.referenceNumber || ''),
        NMR_BKT: extractCode(item.referenceNumber) || '-',
        TANGGAL: new Date(item.date).toLocaleDateString('id-ID'),
        KO_REKG: item.kodeAccount,
        Nama_REKG: item.accountName,
        DBT_KRD: Number(item.debit) > 0 ? 'D' : 'K',
        NKB: '-',
        FISIK:
          item.fisikWarehouseIssue ||
          item.fisikWarehouseReceipt ||
          (Number(item.debit) > 0
            ? firstItem?.quantity || Number(item.creditDollar) || Number(item.debitDollar)
            : Number(item.creditDollar) || Number(item.debitDollar)),
        SBRG: '-',
        REKLA: '-',
        RPH:
          Number(item.debit) > 0
            ? currencyFormatter(Number(item.debit))
            : currencyFormatter(Number(item.credit)),
        KETER: item.description,
        KO_KEB: item.unit?.nama || '',
        KO_BUD: '',
        KD_IMPORT: 'TRAN',
      };
    }
  });

  // Ubah object → array sesuai urutan headers
  const rows = rowObjects.map((row: any) => headers.map((h) => row[h] ?? ''));

  // Gabungkan header + rows
  const worksheetData = [headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Buku Besar-${periode}`);

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `buku_besar_export_${periode}.xlsx`);
};

export default exportToExcel;
