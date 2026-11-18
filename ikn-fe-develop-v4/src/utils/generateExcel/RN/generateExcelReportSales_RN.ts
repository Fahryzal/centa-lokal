import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as SalesReportInterfaces from '@pages/marketing/sales-report/interface/SalesReportRaExcelInterfaces';
import dayjs from 'dayjs';
import { preciseSubtract } from '@/utils/helper';

export const generateExcelReportSales_RN = (
  data: SalesReportInterfaces.SalesReportRaExcelInterfaces[],
  periode?: [any, any] | any
) => {
  // Sheet 2: Items
  const startDate = periode?.[0]?.format('YYYY-MM-DD');
  const endDate = periode?.[1]?.format('YYYY-MM-DD');

  const headerData = [
    ['LAPORAN PENJUALAN UNIT RN'],
    [`Unit    : RN`],
    [`Tanggal : ${startDate} s/d ${endDate}`],
    [], // spasi baris
  ];

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
      'Nama Barang': item.namabarangProduct,
      'Nama Customer': item?.spb?.customerName,
      Kuantitas: item.quantity,
      'Harga Satuan': item.priceProduct,
      Total: item.quantity * item.priceProduct,
      Spesifikasi: item.spesifikasiProduct,
      Kategori: item.kategoriProduct,
      Satuan: item.satuanProduct,
      Berat: item.beratproduct,
      Unit: item.unitProduct,
      PPN: ppnProduk,
      'Total dengan PPN': hargaProduk + ppnProduk,
      'Tangga Pesanan': dayjs(item.date).format('DD-MM-YYYY'),
      'Tanggal SPB': dayjs(item?.spb?.tanggalPengiriman).format('DD-MM-YYYY'),
    };
  });

  // Buat workbook dan sheet
  const workbook = XLSX.utils.book_new();
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

  // const worksheetHeader = XLSX.utils.json_to_sheet(headerData);
  // const worksheetItems = XLSX.utils.json_to_sheet(itemsData);

  // XLSX.utils.boo  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Penjualan');
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Penjualan');

  // Export ke file
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });
  saveAs(blob, 'Laporan_Penjualan_RN.xlsx');
};
