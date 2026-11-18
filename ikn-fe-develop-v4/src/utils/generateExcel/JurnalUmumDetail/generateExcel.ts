import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as JurnalUmumInterfaces from '@/pages/keuangan/jurnal/jurnal-umum/interfaces/JurnalUmumInterfaces';

export const handleExportJurnalUmumDetail = (
  data: JurnalUmumInterfaces.JurnalUmumDetailInterface[]
) => {
  // Sheet 2: Items
  const itemsData = data.map((item, index) => ({
    No: index + 1,
    'Nomor Jurnal': item.numberJurnal,
    'Nomor Referensi': item.referenceNumber,
    'Kode Akun': item.kodeAccount,
    Tanggal: new Date(item.date).toLocaleDateString(),
    Deskripsi: item.description,
    Debit: item.debit,
    Credit: item.credit,
  }));

  // Buat workbook dan sheet
  const workbook = XLSX.utils.book_new();
  const worksheetItems = XLSX.utils.json_to_sheet(itemsData);
  XLSX.utils.book_append_sheet(workbook, worksheetItems, 'Jurnal Detail');

  // Export ke file
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });
  saveAs(blob, 'Jurnal Umum Detail.xlsx');
};
