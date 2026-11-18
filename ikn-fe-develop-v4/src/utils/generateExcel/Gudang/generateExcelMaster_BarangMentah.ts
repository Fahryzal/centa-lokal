import * as XLSX from 'xlsx-js-style';
import type { Dayjs } from 'dayjs';

interface BarangMentahExcelRow {
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

export const generateExcelMasterBarangMentah = (
  data: BarangMentahExcelRow[],
  selectedMonth: Dayjs
): void => {
  try {
    // Judul laporan dan periode stok
    const title = 'Data Master Barang Mentah';
    const factory = 'PABRIK RUBBER ARTICLE';
    const period = `Stok Barang: ${selectedMonth.format('MMMM YYYY')}`;

    // Header tabel
    const headers = [
      'Account',
      'Kode',
      'Nama Barang',
      'Satuan',
      'Unit',
      'Stock',
      'Harga Satuan',
      'Saldo Akhir',
    ];

    // Konversi data dashboard menjadi baris Excel
    const rows = data.map((item) => {
      const stock = Number(item.stokterKiniAll ?? 0);
      const averageCost = Number(item.averageCost ?? 0);

      return [
        item.accountCode ?? '-',
        item.itemCode ?? '-',
        item.itemName ?? '-',
        item.satuan ?? '-',
        item.unit?.nama ?? '-',
        stock,
        averageCost,
        stock * averageCost,
      ];
    });

    // Total seluruh nilai pada kolom Saldo Akhir
    const totalSaldoAkhir = rows.reduce((sum, row) => sum + Number(row[7] ?? 0), 0);

    // Membuat worksheet dengan judul, pabrik, periode, header, data, dan total
    const worksheet = XLSX.utils.aoa_to_sheet([
      [title],
      [factory],
      [period],
      [],
      headers,
      ...rows,
      [
        `TOTAL SALDO AKHIR: ${new Intl.NumberFormat('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalSaldoAkhir)}`,
      ],
    ]);

    // Menggabungkan sel judul dan nama pabrik sepanjang 7 kolom
    const totalRowIndex = 5 + rows.length;

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

    // Mengatur lebar setiap kolom
    worksheet['!cols'] = [
      { wch: 18 }, // Account
      { wch: 18 }, // Kode
      { wch: 35 }, // Nama Barang
      { wch: 15 }, // Satuan
      { wch: 22 }, // Unit
      { wch: 15 }, // Stock
      { wch: 20 }, // Harga Satuan
      { wch: 22 }, // Saldo Akhir
    ];

    // Format angka untuk Stock, Harga Satuan, dan Saldo Akhir
    const firstDataRow = 4;
    const lastDataRow = firstDataRow + rows.length - 1;

    for (let row = firstDataRow + 1; row <= lastDataRow; row++) {
      const stockCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 5 })];
      const priceCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 6 })];
      const totalCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 7 })];

      if (stockCell) {
        stockCell.t = 'n';
        stockCell.z = '#,##0.##';
      }

      if (priceCell) {
        priceCell.t = 'n';
        priceCell.z = '"Rp" #,##0.00';
      }

      if (totalCell) {
        totalCell.t = 'n';
        totalCell.z = '"Rp" #,##0.00';
      }
    }

    // Mengatur area cetak dan baris header
    worksheet['!autofilter'] = {
      ref: `A5:H${Math.max(5, lastDataRow + 1)}`,
    };

    // Membuat workbook dan memasukkan worksheet
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Barang Mentah');

    // Nama file mengikuti periode yang dipilih
    const fileMonth = selectedMonth.format('YYYY-MM');

    XLSX.writeFile(workbook, `Data_Master_Barang_Mentah_${fileMonth}.xlsx`);
  } catch (error) {
    console.error('Gagal membuat Excel Master Barang Mentah:', error);
    throw error;
  }
};
