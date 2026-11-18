import type { Dayjs } from 'dayjs';
import * as XLSX from 'xlsx-js-style';

interface BarangJadiExcelRow {
  namaBarang?: string | null;
  kodeBarang?: string | null;
  stokTerkini?: number | string | null;
  stok?: number | string | null;
  kategori?: string | null;
  Satuan?: string | null;
  Total?: number | string | null;
  nilaiSatuan?: number | string | null;
}

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined || value === '') return 0;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const generateExcelMasterBarangJadi = (
  data: BarangJadiExcelRow[],
  selectedMonth: Dayjs
): void => {
  const totalKeseluruhan = data.reduce((sum, item) => sum + toNumber(item.Total), 0);

  const rows = [
    ['DATA MASTER BARANG JADI'],
    ['PABRIK RUBBER ARTICLE'],
    [`Stok Barang: ${selectedMonth.format('MMMM YYYY')}`],
    [],
    ['No', 'Nama Barang', 'Kode Barang', 'Stock', 'Kategori', 'Satuan', 'Nilai Satuan', 'Total'],
    ...data.map((item, index) => [
      index + 1,
      item.namaBarang ?? '-',
      item.kodeBarang ?? '-',
      toNumber(item.stokTerkini ?? item.stok),
      item.kategori ?? '-',
      item.Satuan ?? '-',
      toNumber(item.nilaiSatuan),
      toNumber(item.Total),
    ]),
    [
      {
        v: `TOTAL: ${new Intl.NumberFormat('id-ID', {
          maximumFractionDigits: 2,
        }).format(totalKeseluruhan)}`,
        t: 's',
      },
    ],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 30 },
    { wch: 18 },
    { wch: 15 },
    { wch: 20 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
  ];

  const totalRowIndex = rows.length - 1;

  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
    { s: { r: totalRowIndex, c: 0 }, e: { r: totalRowIndex, c: 7 } },
  ];

  const totalCellAddress = XLSX.utils.encode_cell({
    r: totalRowIndex,
    c: 0,
  });

  worksheet[totalCellAddress].s = {
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
    font: {
      bold: true,
    },
  };

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Barang Jadi');

  XLSX.writeFile(workbook, `Data_Master_Barang_Jadi_${selectedMonth.format('YYYY-MM')}.xlsx`);
};
