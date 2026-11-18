import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { currencyFormatter } from '@/utils/helper';
import { extractCode, getPrefix } from '../func/func';

const exportToPDF = (rawData: any[], periode: string) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  // Header fix
  const headers = [
    [
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
    ],
  ];

  // Mapping raw data ke format tabel
  const rows = rawData.map((item) => {
    const trx = item.transaction;
    const firstItem = trx?.items?.[0];

    const isDebit = Number(item.debit) > 0;
    const nilaiRph = isDebit ? item.debit : item.credit;

    return [
      getPrefix(item?.referenceNumber || getPrefix(trx?.documentNo) || ''), // KO_BKT
      (trx?.documentNo && extractCode(trx?.documentNo)) ||
        (item?.referenceNumber && extractCode(item?.referenceNumber)) ||
        '-', // NMR_BKT
      new Date(item.date).toLocaleDateString('id-ID'), // TANGGAL
      item.kodeAccount, // KO_REKG
      item.accountName, // Nama REKG
      isDebit ? 'D' : 'K', // DBT_KRD
      '-', // NKB (optional)
      item.fisikWarehouseIssue ||
        item.fisikWarehouseReceipt ||
        (Number(item.debit) > 0
          ? firstItem?.quantity ||
            firstItem?.quantity ||
            Number(item.creditDollar) ||
            Number(item.debitDollar)
          : Number(item.creditDollar) || Number(item.debitDollar)), //FISIK
      isDebit ? firstItem?.satuan || '-' : '-', // SBRG
      '-', // REKLA
      currencyFormatter(Number(nilaiRph)), // RPH
      item.description || '-', // KETER_1
      trx?.unit?.nama || item.unit?.nama || '-', // KO_KEB
      '', // KO_BUD
      trx?.faktur || 'TRAN', // KD_IMPORT
    ];
  });

  // Generate table
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 55,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Judul
  doc.setFontSize(12);
  doc.text('Laporan Jurnal / Buku Besar', 40, 25);
  doc.text('Periode ' + periode, 40, 45);

  // Simpan file
  //   doc.save(`journal_export_${new Date().toISOString().split('T')[0]}.pdf`);
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
};

export default exportToPDF;
