import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface JournalEntry {
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
  creditDollar: string;
  debitDollar: string;
}

export function exportJournalToExcel(data: JournalEntry[]) {
  // 1. Ubah data ke format 2D array (header + row)
  const worksheetData = [
    [
      'Reference Number',
      'No Jurnal',
      'Tanggal',
      'Keterangan',
      'Kode Akun',
      'Nama Akun',
      'Debit',
      'Credit',
      'Debit $',
      'Credit $',
    ],
    ...data.map((item) => [
      item.referenceNumber,
      item.numberJurnal,
      new Date(item.date).toLocaleDateString('id-ID'),
      item.description,
      item.kodeAccount,
      item.accountName,
      item.debit,
      item.credit,
      item.debitDollar,
      item.creditDollar,
    ]),
  ];

  // 2. Buat worksheet & workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Jurnal');

  // 3. Convert ke blob
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // 4. Save file
  saveAs(blob, `Journal_${new Date().toISOString().split('T')[0]}.xlsx`);
}
