import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoCompany from '@/assets/image-logo/logo-company-v2.png';
import { currencyFormatter } from '../helper';

export function generateRADeliveryOrderPDF(data: any, title: string, dolarOrRp = 'Rp') {
  const doc = new jsPDF();
  const marginLeft = 14;
  let currentY = 10;
  const imgWidth = 110;

  const purchaseOrder = data?.purchaseOrder ?? data;
  const deliveryOrderDetails = data?.DeliveryOrderDetail ?? [];

  doc.addImage(logoCompany, 'PNG', marginLeft, currentY, 14, 14);
  doc.setFontSize(10);
  doc.text('PT. Industri Karet Nusantara', marginLeft, currentY + 20);

  const maxWidth = 80;

  doc.text(
    'Jl. Medan - Tanjung Morawa Km 9,5 Medan 20148 North Sumatera - Indonesia',
    marginLeft,
    currentY + 25,
    { maxWidth }
  );

  doc.text('Telp: +62 61 786 7566 / +62 811 648 0083', marginLeft, currentY + 35);

  doc.text('Email: ikn@ptikn.com', marginLeft, currentY + 40);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, marginLeft + imgWidth + 10, currentY + 10);

  doc.setFontSize(10);

  const recipientX = 120;

  doc.text('Kepada Yth:', recipientX, currentY + 20);
  doc.text(purchaseOrder?.customerName ?? '-', recipientX, currentY + 26);
  doc.text(`Kontak: ${purchaseOrder?.customer?.phone ?? '-'}`, recipientX, currentY + 32);
  doc.text(`Email: ${purchaseOrder?.customer?.email ?? '-'}`, recipientX, currentY + 38);

  const address = `Alamat: ${purchaseOrder?.customer?.address ?? '-'}`;

  doc.text(address, recipientX, currentY + 44, {
    maxWidth,
  });

  const franco = purchaseOrder?.franco ?? '-';

  doc.text('Franco:', recipientX, currentY + 62);

  const francoLines = doc.splitTextToSize(String(franco), maxWidth - 15);

  doc.text(francoLines, recipientX + 15, currentY + 62);

  const francoHeight = Math.max(francoLines.length * 5, 5);

  currentY += 53;

  const labelX = marginLeft;
  const valueX = marginLeft + 40;

  doc.text('Nomor Pesanan', labelX, currentY);
  doc.text(': ' + (purchaseOrder?.orderNumber ?? '-'), valueX, currentY);

  doc.text('Tanggal', labelX, currentY + 6);
  doc.text(': ' + formatReadableDate(purchaseOrder?.date), valueX, currentY + 6);

  doc.text('Keterangan', labelX, currentY + 12);
  doc.text(': ' + (purchaseOrder?.description || '-'), valueX, currentY + 12);

  doc.setFont('helvetica', 'normal');

  const startY = currentY + 20 + Math.max(francoHeight - 5, 0);

  const items =
    deliveryOrderDetails.length > 0 ? deliveryOrderDetails : (purchaseOrder?.items ?? []);

  const isDeliveryOrderData = deliveryOrderDetails.length > 0;

  autoTable(doc, {
    startY,
    head: [['Kode Barang', 'Nama Barang', 'Spesifikasi', 'Qty', 'Satuan', 'Harga', 'Total']],
    body: items.map((item: any) => {
      const quantity = isDeliveryOrderData
        ? Number(item.qtyKirim ?? 0)
        : Number(item.quantity ?? 0);

      const price = Number(item.priceProduct ?? 0);

      const total = isDeliveryOrderData ? Number(item.total ?? 0) : quantity * price;

      return [
        item.kodeBarangProduct || '-',
        item.namabarangProduct || '-',
        item.spesifikasiProduct || '-',
        quantity.toString(),
        item.satuanProduct || '-',
        `${dolarOrRp} ${currencyFormatter(price)}`,
        `${dolarOrRp} ${currencyFormatter(total)}`,
      ];
    }),
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
    },
  });

  const typedDoc = doc as jsPDF & {
    lastAutoTable: {
      finalY: number;
    };
  };

  const endY = typedDoc.lastAutoTable.finalY + 10;

  const subtotal = isDeliveryOrderData
    ? deliveryOrderDetails.reduce((total: number, item: any) => total + Number(item.total ?? 0), 0)
    : Number(purchaseOrder?.subtotalAmount ?? 0);

  doc.text(`Subtotal   : ${dolarOrRp} ${currencyFormatter(subtotal)}`, 140, endY);

  doc.text('Hormat Kami,', marginLeft, endY + 30);
  doc.text('____________________', marginLeft, endY + 45);
  doc.text('Marketing Department', marginLeft, endY + 51);

  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);

  return {
    url,
    blob: pdfBlob,
  };
}

function formatReadableDate(dateString: string): string {
  if (!dateString) {
    return '-';
  }

  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
