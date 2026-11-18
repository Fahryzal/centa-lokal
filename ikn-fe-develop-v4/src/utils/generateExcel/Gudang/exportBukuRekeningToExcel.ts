import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportBukuRekeningToExcel(data: any) {
  // Header sheet
  const worksheetData = [
    ['Kode Rekening', data.code],
    ['Nama Rekening', data.name],
    ['Unit', data.unit],
    [
      'Periode',
      `${data?.periode?.[0]?.format('YYYY-MM-DD')} - ${data?.periode?.[1]?.format('YYYY-MM-DD')}`,
    ],
    [],
    ['Tanggal', 'No Transaksi', 'Keterangan', 'Nama Akun', 'Debit', 'Kredit', 'Saldo'],
  ];

  // Mapping data buku besar
  data.bukuBesar.forEach((entry: any) => {
    worksheetData.push([
      entry.tanggal ? new Date(entry.tanggal).toLocaleDateString('id-ID') : '',
      entry.noTransaksi || '',
      entry.keterangan || '',
      entry.name || '',
      entry.debit || 0,
      entry.kredit || 0,
      entry.saldo || 0,
    ]);
  });

  // Buat worksheet & workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Buku Besar');

  // Export ke file Excel
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `BukuBesar-${data.code}.xlsx`);
}
