import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Dayjs } from 'dayjs';

interface BarangMentahPDFRow {
  accountCode?: string | null;
  itemCode?: string | null;
  itemName?: string | null;
  satuan?: string | null;
  unit?: {
    nama?: string | null;
  } | null;
  stokterKiniAll?: number | string | null;
  averageCost?: number | string | null;
}

const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatMonthYear = (date: Dayjs): string => {
  return date.format('MMMM YYYY');
};

export const generateBarangMentahPDF = (
  data: BarangMentahPDFRow[],
  selectedMonth: Dayjs
): { blob: Blob; fileName: string } => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 10;
  const marginRight = 10;

  const totalStockValue = data.reduce((total, item) => {
    const stock = toNumber(item.stokterKiniAll);
    const averageCost = toNumber(item.averageCost);

    return total + stock * averageCost;
  }, 0);

  // Judul laporan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('DATA MASTER BARANG MENTAH', pageWidth / 2, 15, {
    align: 'center',
  });
  // Nama pabrik di bawah judul
  doc.setFontSize(11);
  doc.text('PABRIK RUBBER ARTICLE', pageWidth / 2, 21, {
    align: 'center',
  });

  // Periode laporan
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Stok Barang: ${formatMonthYear(selectedMonth)}`, pageWidth / 2, 26, {
    align: 'center',
  });

  // Garis di bawah judul
  doc.setLineWidth(0.4);
  doc.line(marginLeft, 30, pageWidth - marginRight, 30);

  const tableBody: (string | number)[][] = data.map((item, index) => {
    const stock = toNumber(item.stokterKiniAll);
    const averageCost = toNumber(item.averageCost);
    const endingBalance = stock * averageCost;

    return [
      String(index + 1),
      item.accountCode ?? '-',
      item.itemCode ?? '-',
      item.itemName ?? '-',
      item.satuan ?? '-',
      item.unit?.nama ?? '-',
      formatRupiah(stock),
      formatRupiah(averageCost),
      formatRupiah(endingBalance),
    ];
  });

  autoTable(doc, {
    startY: 35,
    margin: {
      left: marginLeft,
      right: marginRight,
      top: 15,
      bottom: 15,
    },
    head: [
      [
        'No',
        'Account',
        'Kode',
        'Nama Barang',
        'Satuan',
        'Unit',
        'Stock',
        'Harga Satuan (Rp)',
        'Saldo Akhir (Rp)',
      ],
    ],
    body: tableBody,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7,
      cellPadding: 2,
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      valign: 'middle',
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 'auto', halign: 'left' },
      4: { cellWidth: 13, halign: 'center' },
      5: { cellWidth: 20, halign: 'center' }, // Unit
      6: { cellWidth: 17, halign: 'right' }, // Stock
      7: { cellWidth: 22, halign: 'right' }, // Harga Satuan
      8: { cellWidth: 24, halign: 'right' }, // Saldo Akhir
    },
    showHead: 'everyPage',
  });

  // Baris TOTAL: gabungkan seluruh kolom menjadi satu sel dan ratakan ke tengah.
  const finalY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 35;

  autoTable(doc, {
    startY: finalY,
    margin: {
      left: marginLeft,
      right: marginRight,
      top: 15,
      bottom: 15,
    },
    body: [
      [
        {
          content: `TOTAL SALDO AKHIR: Rp ${formatRupiah(totalStockValue)}`,
          colSpan: 9,
          styles: {
            halign: 'center',
            fontStyle: 'bold',
            fillColor: [245, 245, 245],
          },
        },
      ],
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 3,
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
    },
    pageBreak: 'avoid',
  });

  const fileName = `Data_Master_Barang_Mentah_${selectedMonth.format('YYYY-MM')}.pdf`;

  return {
    blob: doc.output('blob'),
    fileName,
  };
};
