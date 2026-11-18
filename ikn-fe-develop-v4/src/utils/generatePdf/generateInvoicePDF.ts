import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// import logoCompany from "@/assets/image-logo/logo-company-dumy.png"; // pastikan base64 atau bisa di-handle bundler
import dayjs from 'dayjs';
import { currencyFormatter, terbilangRupiah } from '../helper';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';

export function generateInvoicePDF(data: InvoiceInterfaces.InvoiceType | any) {
  const doc = new jsPDF();
  const marginLeft = 14;
  let currentY = 35;
  // Info pelanggan
  const labelX = marginLeft;
  const valueX = marginLeft + 40; // atur sesuai kebutuhan

  doc.setFontSize(9);
  doc.text(
    `Medan, ${dayjs(data?.dataTTD?.invoiceDateManual || data?.invoiceDate).format('DD MMM YYYY')}`,
    valueX + 80,
    currentY
  );

  // / INVOICE kanan atas
  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  const text = 'INVOICE';
  const spacedText = text.split('').join(' '); // hasil: "I N V O I C E"
  doc.text(spacedText, 130 - marginLeft, currentY + 10, { align: 'right' });
  const lineY = currentY + 13; // sedikit di bawah teks
  doc.line(135 - marginLeft, lineY, marginLeft + 60, lineY); // dari startX ke ujung teks
  currentY += 17; // turun di bawah logo

  doc.setFontSize(10);
  doc.text(`No. ${data.invoiceNumber}`, valueX + 23, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.text('Kepada Yth :', labelX, currentY);
  currentY += 6;
  doc.text(`${data.spb.purchaseOrder.customerName}`, labelX, currentY);
  currentY += 6;
  const address = data.spb.purchaseOrder.customer.address || '-';
  const maxWidth = 140;
  const textLines = doc.splitTextToSize(address, maxWidth);
  doc.text(textLines, labelX, currentY);
  currentY += textLines.length * 5;
  doc.text(`${data.spb.purchaseOrder.customer.phone}`, labelX, currentY);
  currentY += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(`Di tempat`, labelX + 5, currentY);
  currentY += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('Pembelian barang/jasa kepada ', labelX + 50, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text('PT Industi Karet Nusantara', valueX + 63, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('dengan rincian sebagai berikut', labelX + 50, currentY);
  currentY += 12;

  // Deskripsi
  doc.setFont('helvetica', 'bold');
  doc.text('Deskripsi Barang/Jasa:', marginLeft, currentY);
  currentY += 5;
  // Tabel item
  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Nama Barang', 'Keterangan', 'Spesifikasi', 'Qty', 'Satuan', 'Harga', 'Total']],
    body: data.spb.purchaseOrder.items.map((item: any, index: number) => {
      const number = index + 1;
      return [
        number,
        item.namabarangProduct || '-',
        item.namabarangProductInvoice || '-',
        item.spesifikasiProduct || '-',
        item.quantity.toString(),
        item.satuanProduct || '-',
        formatCurrency(item.priceProduct),
        formatCurrency(item.quantity * item.priceProduct),
      ];
    }),
    styles: { fontSize: 9 },
    bodyStyles: { halign: 'right' },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      halign: 'right',
    },
  });

  // update currentY berdasarkan akhir dari tabel
  const typedDoc = doc as jsPDF & { lastAutoTable: { finalY: number } };
  currentY = typedDoc.lastAutoTable.finalY + 2;

  drawSeparator(doc, currentY);
  currentY += 6;

  // Perhitungan
  doc.setFont('helvetica', 'bold');
  doc.text('Rincian Perhitungan:', marginLeft, currentY);
  currentY += 6;

  const calcLeft = marginLeft + 2;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', calcLeft, currentY);
  doc.text(`Rp${currencyFormatter(data.totalAmount)}`, 160, currentY, { align: 'right' });
  currentY += 6;

  // Assuming doc is your PDF document instance
  data.invoiceTaxes
    .filter((itemTax: any) => !itemTax.taxType.toLowerCase().includes('pph'))
    .map((item: any) => {
      doc.text(`+ ${item.taxType}`, calcLeft, currentY);
      doc.text(`Rp${currencyFormatter(item.taxAmount)}`, 160, currentY, {
        align: 'right',
      });
      currentY += 6;
    });

  doc.setFont('helvetica', 'bold');
  doc.text('Total Tagihan', calcLeft, currentY);
  doc.text(`Rp${currencyFormatter(data.amountWithTax)}`, 160, currentY, {
    align: 'right',
  });
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  data.invoiceTaxes
    .filter((itemTax: any) => itemTax.taxType.toLowerCase().includes('pph'))
    .map((item: any) => {
      doc.text(`(-) ${item.taxType} (${item.taxValue * 100}%)`, calcLeft, currentY);
      doc.text(`Rp${currencyFormatter(item.taxAmount)}`, 160, currentY, {
        align: 'right',
      });
      currentY += 6;
    });

  doc.setFont('helvetica', 'bold');

  // drawSeparator(doc, currentY);
  // currentY += 6;

  // Catatan
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Terbilang: ${terbilangRupiah(data.amountWithTax)}`, marginLeft, currentY);
  currentY += 8;
  drawSeparator(doc, currentY);
  currentY += 6;
  // Catatan
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Pembayaran :`, marginLeft, currentY);
  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Silakan lakukan pembayaran ke rekening berikut atas nama perusahaan kami:`,
    marginLeft,
    currentY
  );
  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`PT Industri Karet Nusantara (${data?.dataTTD?.bankName || '-'})`, marginLeft, currentY);
  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`No. Rekening: ${data?.dataTTD?.bankAccountNumber || '-'}`, marginLeft, currentY);
  currentY += 20;

  // Atur ukuran dan posisi kolom
  const signatureBoxWidth = 70;
  const signatureBoxHeight = 35;
  const signatureX = doc.internal.pageSize.getWidth() - marginLeft - signatureBoxWidth;
  const signatureY = currentY;

  // Kotak tanda tangan
  doc.setDrawColor(255); // warna garis
  doc.rect(signatureX, signatureY, signatureBoxWidth, signatureBoxHeight, 'S'); // gambar kotak

  // Teks dalam kotak
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PT INDUSTRI KARET NUSANTARA', signatureX + signatureBoxWidth / 2, signatureY + 6, {
    align: 'center',
  });

  doc.text(
    `${data?.dataTTD?.ttdName || '-'}`,
    signatureX + signatureBoxWidth / 2,
    signatureY + 50,
    {
      align: 'center',
    }
  );

  doc.setFont('helvetica', 'normal');
  doc.text(
    `${data?.dataTTD?.jabatan || '-'}`,
    signatureX + signatureBoxWidth / 2,
    signatureY + 56,
    {
      align: 'center',
    }
  );

  // Update currentY
  currentY = signatureY + signatureBoxHeight + 10;

  // Show PDF
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
}

function drawSeparator(doc: jsPDF, y: number) {
  doc.setLineWidth(0.2); // ketebalan garis
  doc.line(10, y, 190, y); // dari x=20 ke x=190 di posisi y=currentY
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatReadableDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
