import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as OrderPraInterfaces from '@/pages/marketing/order-pra/interface/OrderPraInterfaces';
// import logoCompanyDummy from "@/assets/image-logo/logo-company-dumy.png";
import logoCompany from '@/assets/image-logo/logo-company-v2.png';
import { currencyFormatter } from '../helper';

export function generatePurchaseOrderPDF(
  data: OrderPraInterfaces.PurchaseOrderData,
  title: string,
  dolarOrRp = 'Rp'
) {
  const doc = new jsPDF();
  const marginLeft = 14;
  let currentY = 10;
  const imgWidth = 110;
  // const imgHeight = 15;

  // Logo dan info perusahaan
  doc.addImage(logoCompany, 'PNG', marginLeft, currentY, 14, 14);
  doc.setFontSize(10);
  doc.text('PT. Industri Karet Nusantara', marginLeft, currentY + 20);
  const maxWidth = 80; // misalnya lebar maksimum konten (dalam satuan jsPDF)
  doc.text(
    'Jl. Medan - Tanjung Morawa Km 9,5 Medan 20148 North Sumatera - Indonesia',
    marginLeft,
    currentY + 25,
    { maxWidth }
  );
  doc.text('Telp: +62 61 786 7566 / +62 811 648 0083', marginLeft, currentY + 35);
  doc.text('Email: ikn@ptikn.com', marginLeft, currentY + 40);

  // Judul PO
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, marginLeft + imgWidth + 10, currentY + 10);

  // Info Penerima (Customer)
  doc.setFontSize(10);
  const recipientX = 120;
  doc.text('Kepada Yth:', recipientX, currentY + 20);
  doc.text(data.customerName, recipientX, currentY + 26);
  doc.text(`Kontak: ${data.customer.phone}`, recipientX, currentY + 32);
  doc.text(`Email: ${data.customer.email}`, recipientX, currentY + 38);
  doc.text(`Alamat: ${data.customer.address}`, recipientX, currentY + 44, { maxWidth });
  const francoLabel = 'Franco :';
  const francoX = recipientX + 15;
  const francoMaxWidth = 55;

  doc.text(francoLabel, recipientX, currentY + 62);

  const francoLines = doc.splitTextToSize(data.franco || '-', francoMaxWidth);

  doc.text(francoLines, francoX, currentY + 62);

  // Info PO
  currentY += 53;
  const labelX = marginLeft;
  const valueX = marginLeft + 40; // atur sesuai kebutuhan
  doc.text('Nomor Pesanan', labelX, currentY);
  doc.text(': ' + data.orderNumber, valueX, currentY);

  doc.text('Tanggal', labelX, currentY + 6);
  doc.text(': ' + formatReadableDate(data.date), valueX, currentY + 6);

  doc.text('Keterangan', labelX, currentY + 12);
  doc.text(': ' + (data.description || '-'), valueX, currentY + 12);
  doc.setFont('helvetica', 'normal');

  // Table Items
  const startY = currentY + 20;

  autoTable(doc, {
    startY,
    head: [['Kode Barang', 'Nama Barang', 'Spesifikasi', 'Qty', 'Satuan', 'Harga', 'Total']],
    body: data.items.map((item) => [
      item.kodeBarangProduct || '-',
      item.namabarangProduct || '-',
      item.spesifikasiProduct || '-',
      item.quantity.toString(),
      item.satuanProduct || '-',
      `${dolarOrRp} ${currencyFormatter(item.priceProduct)}`,
      `${dolarOrRp + currencyFormatter(item.quantity * item.priceProduct)}`,
    ]),
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
    },
  });

  const typedDoc = doc as jsPDF & { lastAutoTable: { finalY: number } };
  const endY = typedDoc.lastAutoTable.finalY + 10;

  // Ringkasan total
  doc.text(`Subtotal   : ${dolarOrRp + currencyFormatter(data.subtotalAmount)}`, 140, endY);
  // Tanda tangan
  doc.text('Hormat Kami,', marginLeft, endY + 30);
  doc.text('____________________', marginLeft, endY + 45);
  doc.text('Marketing Department', marginLeft, endY + 51);

  // Tampilkan di tab baru
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  return {
    url,
    blob: pdfBlob,
  };
}

function formatReadableDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long', // Menambahkan nama hari
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
