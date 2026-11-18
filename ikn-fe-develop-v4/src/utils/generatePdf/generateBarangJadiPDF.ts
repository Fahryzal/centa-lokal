import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Dayjs } from 'dayjs';

interface BarangJadiPDFRow {
  namaBarang?: string | null;
  kodeBarang?: string | null;
  stokTerkini?: number | string | null;
  stok?: number | string | null;
  kategori?: string | null;
  Satuan?: string | null;
  nilaiSatuan?: number | string | null;
  Total?: number | string | null;
}

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined || value === '') return 0;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(value);

export const generateBarangJadiPDF = (
  data: BarangJadiPDFRow[],
  selectedMonth: Dayjs
): { blob: Blob; fileName: string } => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Judul utama
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('DATA MASTER BARANG JADI', pageWidth / 2, 15, {
    align: 'center',
  });

  // Nama pabrik di bawah judul
  doc.setFontSize(11);
  doc.text('PABRIK RUBBER ARTICLE', pageWidth / 2, 21, {
    align: 'center',
  });

  // Periode stok
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Stok Barang: ${selectedMonth.format('MMMM YYYY')}`, pageWidth / 2, 26, {
    align: 'center',
  });

  const tableRows = data.map((item, index) => [
    String(index + 1),
    item.namaBarang ?? '-',
    item.kodeBarang ?? '-',
    formatNumber(toNumber(item.stokTerkini ?? item.stok)),
    item.kategori ?? '-',
    item.Satuan ?? '-',
    formatNumber(toNumber(item.nilaiSatuan)),
    formatNumber(toNumber(item.Total)),
  ]);

  const totalStockValue = data.reduce((sum, item) => sum + toNumber(item.Total), 0);

  // Tabel utama
  autoTable(doc, {
    startY: 34,
    margin: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
    tableWidth: 'auto',
    head: [
      ['No', 'Nama Barang', 'Kode Barang', 'Stock', 'Kategori', 'Satuan', 'Nilai Satuan', 'Total'],
    ],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: { top: 3, right: 2, bottom: 3, left: 2 },
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      valign: 'middle',
      overflow: 'linebreak',
      minCellHeight: 8,
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      minCellHeight: 9,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 58, halign: 'left' },
      2: { cellWidth: 38, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 37, halign: 'left' },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 42, halign: 'right' },
      7: { cellWidth: 45, halign: 'right' },
    },
    showHead: 'everyPage',
  });

  const finalY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 34;

  // Baris total digabung sepanjang delapan kolom dan rata tengah
  autoTable(doc, {
    startY: finalY,
    margin: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
    tableWidth: 'auto',
    body: [
      [
        {
          content: `TOTAL: ${formatNumber(totalStockValue)}`,
          colSpan: 8,
          styles: {
            halign: 'center',
            valign: 'middle',
            fontStyle: 'bold',
            fontSize: 10,
            fillColor: [245, 245, 245],
            minCellHeight: 11,
          },
        },
      ],
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 3,
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
    },
    pageBreak: 'avoid',
  });

  return {
    blob: doc.output('blob'),
    fileName: `Data_Master_Barang_Jadi_${selectedMonth.format('YYYY-MM')}.pdf`,
  };
};
