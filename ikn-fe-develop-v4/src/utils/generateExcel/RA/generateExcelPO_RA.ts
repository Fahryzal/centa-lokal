import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as OrderPraInterfaces from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';

export const handleExportPO_RA = (data: OrderPraInterfaces.PurchaseOrderData) => {
  // Sheet 1: Header
  const headerData = [
    {
      'Order Number': data.orderNumber,
      'Order Date': new Date(data.date).toLocaleDateString(),
      'Customer Name': data.customerName,
      'Customer Address': data.customer.address,
      Description: data.description,
      Subtotal: data.subtotalAmount,
      'Tax Amount': data.taxAmount,
      'Total Amount': data.totalAmount,
      Status: data.status,
    },
  ];

  // Sheet 2: Items
  const itemsData = data.items.map((item, index) => ({
    No: index + 1,
    'Kode Barang': item.kodeBarangProduct,
    'Nama Barang': item.namabarangProduct,
    Spesifikasi: item.spesifikasiProduct,
    Kategori: item.kategoriProduct,
    Satuan: item.satuanProduct,
    Berat: item.beratproduct,
    Kuantitas: item.quantity,
    'Harga Satuan': item.priceProduct,
    Total: item.quantity * item.priceProduct,
    Unit: item.unitProduct,
  }));

  // Buat workbook dan sheet
  const workbook = XLSX.utils.book_new();
  const worksheetHeader = XLSX.utils.json_to_sheet(headerData);
  const worksheetItems = XLSX.utils.json_to_sheet(itemsData);

  XLSX.utils.book_append_sheet(workbook, worksheetHeader, 'Header');
  XLSX.utils.book_append_sheet(workbook, worksheetItems, 'Items');

  // Export ke file
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });
  saveAs(blob, 'PO_Detail_RA.xlsx');
};
