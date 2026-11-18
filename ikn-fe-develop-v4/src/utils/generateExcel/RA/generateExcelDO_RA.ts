import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as OrderPraInterfaces from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';

export const handleExportDO_RA = (
  data: OrderPraInterfaces.PurchaseOrderData,
  deliveryOrder?: any
) => {
  const isNewData =
    Array.isArray(deliveryOrder?.DeliveryOrderDetail) &&
    deliveryOrder.DeliveryOrderDetail.length > 0;

  const headerData = [
    {
      'Order Number': data.orderNumber,
      'Order Date': new Date(data.date).toLocaleDateString(),
      'Customer Name': data.customerName,
      'Customer Address': data.customer.address,
      Description: data.description,

      Subtotal: isNewData ? Number(deliveryOrder?.totalAmount ?? 0) : data.subtotalAmount,

      'Tax Amount': isNewData
        ? (() => {
            const purchaseOrderTax = deliveryOrder?.purchaseOrder?.PurchaseOrderTax ?? [];

            const taxValue = purchaseOrderTax.reduce(
              (total: number, tax: any) => total + Number(tax.taxValue ?? 0),
              0
            );

            return Number(deliveryOrder?.totalAmount ?? 0) * taxValue;
          })()
        : data.taxAmount,

      'Total Amount': isNewData
        ? (() => {
            const subtotal = Number(deliveryOrder?.totalAmount ?? 0);

            const purchaseOrderTax = deliveryOrder?.purchaseOrder?.PurchaseOrderTax ?? [];

            const taxValue = purchaseOrderTax.reduce(
              (total: number, tax: any) => total + Number(tax.taxValue ?? 0),
              0
            );

            const tax = subtotal * taxValue;

            return subtotal + tax;
          })()
        : data.totalAmount,

      Status: data.status,
    },
  ];

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

  const workbook = XLSX.utils.book_new();
  const worksheetHeader = XLSX.utils.json_to_sheet(headerData);
  const worksheetItems = XLSX.utils.json_to_sheet(itemsData);

  XLSX.utils.book_append_sheet(workbook, worksheetHeader, 'Header');

  XLSX.utils.book_append_sheet(workbook, worksheetItems, 'Items');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });

  saveAs(blob, 'DO_Detail_RA.xlsx');
};
