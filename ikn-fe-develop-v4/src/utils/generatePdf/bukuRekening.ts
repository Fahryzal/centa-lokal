import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { currencyFormatter } from '../helper';
import dayjs from 'dayjs';

interface LedgerMeta {
  judul: string;
}

const ledgerMeta: LedgerMeta = {
  judul: 'BUKU REKENING',
};

const generateLedgerPDF = (data: any): void => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = 297; // A4 landscape width in mm
  let y = 10;

  // === Title ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(ledgerMeta.judul, 148.5, y, { align: 'center' });
  y += 8;
  doc.setFontSize(10);
  doc.text(`UNIT - ${data.unit}`, 148.5, y, { align: 'center' });
  y += 10;

  const summaryData = [
    [
      'Saldo Awal Debet:',
      currencyFormatter(data?.totalDebitAwal || 0),
      'Mutasi Debit',
      currencyFormatter(data?.sumDebit || 0),
      'Saldo Akhir Debit',
      currencyFormatter(data?.sumAllDebit || 0),
    ],
    [
      'Saldo Awal Kredit:',
      currencyFormatter(data?.totalCreditAwal || 0),
      'Mutasi Kredit',
      currencyFormatter(data?.sumCredit || 0),
      'Saldo Akhir Kredit',
      currencyFormatter(data?.sumAllCredit || 0),
    ],
  ];

  // Calculate total table width for summary table
  const summaryColumnWidths = [40, 30, 40, 40, 40, 40]; // From columnStyles
  const summaryTableWidth = summaryColumnWidths.reduce((a, b) => a + b, 0); // 230mm
  const summaryMargin = (pageWidth - summaryTableWidth) / 2; // Center the table

  autoTable(doc, {
    startY: y,
    head: [
      [
        'COA',
        `: ${data?.code}`,
        '',
        '',
        'Periode',
        `: ${data?.periode?.[0]?.format('YYYY-MM-DD')} - ${data?.periode?.[1]?.format('YYYY-MM-DD')}`,
      ],
      [
        'Nama Akun',
        `: ${data?.name}`,
        '',
        '',
        // 'Tahun', `: ${dayjs(data?.periode).year()}`
      ],
    ],
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, halign: 'left' },
    headStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: 'bold', fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 50, halign: 'left' },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 30 },
      5: { cellWidth: 40 },
    },
    margin: { left: summaryMargin, right: summaryMargin },
  });

  y = (doc as any).lastAutoTable.finalY + 5;

  // === Transaction Table ===
  let runningBalance = 0;
  const body = data?.bukuBesar?.map((r: any) => {
    runningBalance += r.debit - r.kredit;
    return [
      dayjs(r.tanggal).format('DD/MM/YYYY'),
      r.keterangan,
      r.noTransaksi,
      currencyFormatter(r.debit || 0),
      currencyFormatter(r.kredit || 0),
      currencyFormatter(runningBalance || 0),
    ];
  });
  // Calculate total table width for transaction table
  const transactionColumnWidths = [38, 39, 39, 39, 39, 38]; // From columnStyles
  const transactionTableWidth = transactionColumnWidths.reduce((a, b) => a + b, 0); // 230mm
  const transactionMargin = (pageWidth - transactionTableWidth) / 2; // Center the table

  autoTable(doc, {
    startY: y,
    head: [['Tanggal', 'Keterangan', 'No Transaksi', 'Debet', 'Kredit', 'Saldo']],
    body,
    // foot: [
    //   [
    //     // { content: 'Total', styles: { halign: 'left', fontStyle: 'bold' } },
    //     { content: '' },
    //     { content: '' },
    //     {
    //       content: currencyFormatter(data?.totalSaldoDebit || 0),
    //       styles: { halign: 'right', fontStyle: 'bold' },
    //     },
    //     {
    //       content: currencyFormatter(data?.totalSaldoCredit || 0),
    //       styles: { halign: 'right', fontStyle: 'bold' },
    //     },
    //     { content: '', styles: { halign: 'right' } },
    //   ],
    // ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, halign: 'right' },
    headStyles: { fillColor: [240, 240, 240], textColor: 20, halign: 'center' },
    // columnStyles: {
    //   0: { cellWidth: 38.5, halign: 'left' },
    //   1: { cellWidth: 38.5 },
    //   2: { cellWidth: 38.5, halign: 'center' },
    //   3: { cellWidth: 38.5 },
    //   4: { cellWidth: 38.5 },
    //   5: { cellWidth: 38.5 },
    // },
    margin: { left: transactionMargin, right: transactionMargin },
  });

  // === Preview in Browser ===
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
};

export default generateLedgerPDF;
