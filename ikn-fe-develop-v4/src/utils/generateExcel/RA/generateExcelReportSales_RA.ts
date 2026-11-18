import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as SalesReportInterfaces from '@pages/marketing/sales-report/interface/SalesReportRaExcelInterfaces';
import dayjs, { Dayjs } from 'dayjs';
import { preciseSubtract } from '@/utils/helper';

export const generateExcelReportSales_RA = (
  data: SalesReportInterfaces.SalesReportRaExcelInterfaces[],
  periode?: [Dayjs, Dayjs] | any
) => {
  // =========================
  // HEADER LAPORAN (AOA)
  // =========================

  const startDate = periode?.[0]?.format('YYYY-MM-DD');
  const endDate = periode?.[1]?.format('YYYY-MM-DD');

  const headerData = [
    ['LAPORAN PENJUALAN UNIT RA'],
    [`Unit    : RA`],
    [`Tanggal : ${startDate} s/d ${endDate}`],
    [], // spasi baris
  ];

  // =========================
  // DATA ITEMS
  // =========================
  const itemsData = data.map((item, index) => {
    const hargaProduk = item.priceProduct * item.quantity;
    const subtotalSpb = item?.spb?.subtotalAmount || 0;
    const taxAmountSpb = Number(item?.spb?.taxAmount) || 0;
    const ppnSpb = preciseSubtract(taxAmountSpb, subtotalSpb); // total PPN di SPB ini

    // Hitung proporsi PPN untuk produk ini
    const ppnProduk = subtotalSpb > 0 ? (hargaProduk / subtotalSpb) * ppnSpb : 0;

    return {
      No: index + 1,
      'Nomor Pesanan': item.orderNumber,
      'Nomor SPB': item?.spb?.noSpb,
      'Nomor Invoice': item?.spb?.invoice?.invoiceNumber,
      'Nomor Kontrak': item?.spb?.purchaseOrder?.description,
      Kebun: item?.spb?.purchaseOrder.typePo,
      'Nama Customer': item?.spb?.customerName,
      Franco: item?.spb?.franco,
      'Nama Barang': item.namabarangProductInvoice,
      Keterangan: item.namabarangProductInvoice,
      Spesifikasi: item.spesifikasiProduct,
      'Tanggal Pesanan': dayjs(item.date).format('DD-MM-YYYY'),
      'Tanggal SPB': dayjs(item.spb?.tanggalPengiriman).format('DD-MM-YYYY'),
      Kategori: item.kategoriProduct,
      Satuan: item.satuanProduct,
      Berat: item.beratproduct,
      Kuantitas: item.quantity,
      'Harga Satuan': item.priceProduct,
      Total: item.quantity * item.priceProduct,
      PPN: ppnProduk,
      'Total dengan PPN': hargaProduk + ppnProduk,
      Unit: item.unitProduct,
    };
  });

  // =========================
  // BUAT WORKBOOK & SHEET
  // =========================
  const workbook = XLSX.utils.book_new();

  // Sheet awal dari header
  const worksheet = XLSX.utils.aoa_to_sheet(headerData);

  // Tambahkan tabel item mulai baris ke-6
  XLSX.utils.sheet_add_json(worksheet, itemsData, {
    origin: 'A6',
  });

  // Merge cell untuk judul
  worksheet['!merges'] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 10 }, // sesuaikan jumlah kolom
    },
  ];

  // Styling sederhana (judul)
  worksheet['A1'].s = {
    font: { bold: true, sz: 14 },
    alignment: { horizontal: 'center' },
  };

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Penjualan');

  // =========================
  // EXPORT FILE
  // =========================
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });

  saveAs(blob, 'Laporan_Penjualan_RA.xlsx');
};
