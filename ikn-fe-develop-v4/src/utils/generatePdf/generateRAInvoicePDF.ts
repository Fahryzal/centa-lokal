import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import { currencyFormatter, terbilangRupiah } from '../helper';
import * as InvoiceInterfaces from '@pages/marketing/invoice/interface/InvoiceInterfaces';
import kopSurat from '@/assets/image-logo/kop-surat.png';

type RAInvoiceItem = {
  id?: string;
  kodeBarangProduct?: string | null;
  namabarangProduct?: string | null;
  namabarangProductInvoice?: string | null;
  spesifikasiProduct?: string | null;
  satuanProduct?: string | null;
  unitProduct?: string | null;
  quantity?: number | null;
  qtyKirim?: number | null;
  priceProduct?: number | string | null;
  total?: number | null;
};

type RAInvoiceDetail = {
  id?: string;
  invoiceId?: string;
  spbId?: string;
  itemsSpbId?: string;
  SPB?: {
    id?: string;
    noSpb?: string | null;
    purchaseOrder?: {
      customerName?: string | null;
      customer?: {
        address?: string | null;
        phone?: string | null;
        unit?: string | null;
      } | null;
      orderNumber?: string | null;
      date?: string | Date | null;
      kebun?: string | null;
    } | null;
  } | null;
  itemsSPB?: RAInvoiceItem | null;
};

type RAInvoiceTax = {
  id?: string;
  invoiceId?: string;
  taxId?: string;
  taxType?: string | null;
  taxValue?: number | null;
  withheldByCustomer?: boolean;
  isIncludedInPrice?: boolean;
  taxAmount?: number | null;
};

type RASpbLegacy = {
  id?: string;
  noSpb?: string | null;
  purchaseOrder?: {
    customerName?: string | null;
    customer?: {
      address?: string | null;
      phone?: string | null;
      unit?: string | null;
    } | null;
  } | null;
  itemsSPB?: RAInvoiceItem[];
};

type RAInvoiceData = InvoiceInterfaces.InvoiceType & {
  InvoiceDetail?: RAInvoiceDetail[];
  invoiceTaxes?: RAInvoiceTax[];
  BankAccount?: {
    bankName?: string | null;
    bankAccountNumber?: string | null;
  } | null;
  spb?: RASpbLegacy | null;
  invoiceNumber?: string | null;
  invoiceDate?: string | Date | null;
  totalAmount?: number | null;
  amountWithTax?: number | null;
  amountTax?: number | null;
  bankAccountId?: string | null;
  namaAtasan?: string | null;
  jabatanAtasan?: string | null;
};

type RASpbSection = {
  spbId: string;
  noSpb: string;
  details: {
    item: RAInvoiceItem;
    quantity: number;
  }[];
};

const safeNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

const safeText = (value: unknown, fallback = '-'): string => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return String(value);
};

const isPphTax = (tax: RAInvoiceTax): boolean => {
  return safeText(tax.taxType, '').toLowerCase().includes('pph');
};

const formatCurrency = (value: unknown): string => {
  return `Rp${currencyFormatter(safeNumber(value))}`;
};

const drawSeparator = (doc: jsPDF, y: number) => {
  const marginLeft = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.line(marginLeft, y, pageWidth - marginLeft, y);
};

const drawInvoiceFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;
  const marginRight = 14;
  const lineY = pageHeight - 26;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.line(marginLeft, lineY, pageWidth - marginRight, lineY);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  doc.text(
    '— Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif',
    marginLeft + 15,
    pageHeight - 22
  );

  doc.setFontSize(8);

  doc.text('Head Office :', pageWidth - marginRight, pageHeight - 22.5, {
    align: 'right',
  });

  doc.setFontSize(7.5);

  doc.text('Jl. Medan – Tg. Morawa Km. 9,5 Medan 20148', pageWidth - marginRight, pageHeight - 17, {
    align: 'right',
  });

  doc.text(
    'Telp. (061) 7867357 – 7867566 Fax (061) 7867356',
    pageWidth - marginRight,
    pageHeight - 13,
    { align: 'right' }
  );

  doc.text('Email : ikn@email.ptpn3.co.id', pageWidth - marginRight, pageHeight - 9, {
    align: 'right',
  });
};

export async function generateRAInvoicePDF(data: RAInvoiceData | any) {
  const doc = new jsPDF();

  doc.addImage(kopSurat, 'PNG', 0, 0, 210, 33);

  const marginLeft = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerTop = pageHeight - 29;

  let currentY = 38;

  const labelX = marginLeft;
  const valueX = marginLeft + 40;
  const rightX = pageWidth - marginLeft;

  const invoiceDetails: RAInvoiceDetail[] = Array.isArray(data?.InvoiceDetail)
    ? data.InvoiceDetail
    : [];

  const invoiceTaxes: RAInvoiceTax[] = Array.isArray(data?.invoiceTaxes) ? data.invoiceTaxes : [];

  const isNewInvoice = invoiceDetails.length > 0;
  const firstDetail = invoiceDetails[0];

  const purchaseOrder = isNewInvoice
    ? (firstDetail?.SPB?.purchaseOrder ?? null)
    : (data?.spb?.purchaseOrder ?? null);

  const customerName = safeText(purchaseOrder?.customerName);
  const customerUnit = safeText(purchaseOrder?.customer?.unit, '');

  const customerDisplayName =
    customerUnit && customerUnit !== '-' ? `${customerName} - ${customerUnit}` : customerName;

  const customerAddress = safeText(purchaseOrder?.customer?.address);
  const customerPhone = safeText(purchaseOrder?.customer?.phone);

  const orderNumber = safeText(purchaseOrder?.orderNumber ?? data?.purchaseOrder?.orderNumber);

  const orderDate = purchaseOrder?.date ?? data?.purchaseOrder?.date;
  const kebun = safeText(purchaseOrder?.kebun ?? data?.purchaseOrder?.kebun);

  const spbSections: RASpbSection[] = [];

  if (isNewInvoice) {
    const spbMap = new Map<string, RASpbSection>();

    invoiceDetails.forEach((detail) => {
      const spbId = safeText(detail?.spbId);

      if (!detail?.itemsSPB) {
        return;
      }

      if (!spbMap.has(spbId)) {
        spbMap.set(spbId, {
          spbId,
          noSpb: safeText(detail?.SPB?.noSpb),
          details: [],
        });
      }

      spbMap.get(spbId)?.details.push({
        item: detail.itemsSPB,
        quantity: safeNumber(detail.itemsSPB.qtyKirim),
      });
    });

    spbSections.push(...Array.from(spbMap.values()));
  } else {
    const legacySpb = data?.spb;

    if (legacySpb) {
      const spbId = safeText(legacySpb?.id);

      const details = Array.isArray(legacySpb?.itemsSPB)
        ? legacySpb.itemsSPB.map((item: RAInvoiceItem) => ({
            item,
            quantity: safeNumber(item?.quantity),
          }))
        : [];

      spbSections.push({
        spbId,
        noSpb: safeText(legacySpb?.noSpb),
        details,
      });
    }
  }

  doc.setFontSize(8.5);

  doc.text(`Medan, ${dayjs(data?.invoiceDate).format('DD MMM YYYY')}`, valueX + 80, currentY);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');

  const invoiceTitle = 'INVOICE';
  const spacedInvoiceTitle = invoiceTitle.split('').join(' ');

  doc.text(spacedInvoiceTitle, 130 - marginLeft, currentY + 10, {
    align: 'right',
  });

  const lineY = currentY + 13;

  doc.line(135 - marginLeft, lineY, marginLeft + 60, lineY);

  currentY += 17;

  doc.setFontSize(9);

  doc.text(`No. ${safeText(data?.invoiceNumber)}`, valueX + 23, currentY);

  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  doc.text('Kepada Yth :', labelX, currentY);

  currentY += 3.5;

  doc.setFontSize(9);

  doc.text(customerDisplayName, labelX, currentY);

  currentY += 3.5;

  doc.setFontSize(8);

  const addressLines = doc.splitTextToSize(customerAddress, 140);

  doc.text(addressLines, labelX, currentY);

  currentY += addressLines.length * 4;

  doc.text(customerPhone, labelX, currentY);

  currentY += 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('Di tempat', labelX + 5, currentY);

  currentY += 4;

  doc.setFontSize(8.5);

  doc.text('Pembelian barang/jasa kepada ', labelX + 50, currentY);

  doc.setFont('helvetica', 'normal');

  doc.text('PT Industri Karet Nusantara', valueX + 63, currentY);

  currentY += 4;

  doc.setFont('helvetica', 'bold');

  doc.text('dengan rincian sebagai berikut', labelX + 50, currentY);

  currentY += 4;

  doc.setFontSize(8.5);

  doc.text('Deskripsi Barang/Jasa:', marginLeft, currentY);

  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  doc.text(
    `${orderNumber} - ${orderDate ? dayjs(orderDate).format('DD MMM YYYY') : '-'}`,
    marginLeft,
    currentY
  );

  currentY += 4;

  doc.text(kebun, marginLeft, currentY);

  currentY += 4;

  if (spbSections.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    doc.text('Tidak ada detail barang.', marginLeft, currentY);

    currentY += 7;
  } else {
    const tableBody: any[] = [];

    spbSections.forEach((section, sectionIndex) => {
      const detailCount = section.details.length;

      section.details.forEach((detail, detailIndex) => {
        const item = detail.item;
        const quantity = safeNumber(detail.quantity);
        const total = quantity * safeNumber(item?.priceProduct);

        const row: any[] = [];

        if (detailIndex === 0) {
          row.push({
            content: sectionIndex + 1,
            rowSpan: detailCount,
            styles: {
              halign: 'center',
              valign: 'middle',
            },
          });

          row.push({
            content: section.noSpb,
            rowSpan: detailCount,
            styles: {
              halign: 'left',
              valign: 'middle',
            },
          });
        }

        row.push(
          safeText(item?.namabarangProductInvoice ?? item?.namabarangProduct),
          safeText(item?.spesifikasiProduct),
          quantity.toString(),
          safeText(item?.satuanProduct),
          formatCurrency(item?.priceProduct),
          formatCurrency(total)
        );

        tableBody.push(row);
      });
    });

    autoTable(doc, {
      startY: currentY,
      head: [['No', 'No SPB', 'Nama Barang', 'Spesifikasi', 'Qty', 'Satuan', 'Harga', 'Total']],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: {
          top: 1,
          right: 1.5,
          bottom: 1,
          left: 1.5,
        },
        minCellHeight: 5,
        valign: 'middle',
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold',
        fontSize: 7,
        cellPadding: {
          top: 1.5,
          right: 1.5,
          bottom: 1.5,
          left: 1.5,
        },
        overflow: 'ellipsize',
      },
      bodyStyles: {
        valign: 'middle',
        fontSize: 7,
      },
      columnStyles: {
        0: {
          halign: 'center',
          cellWidth: 8,
        },
        1: {
          halign: 'left',
          cellWidth: 27,
        },
        2: {
          halign: 'left',
          cellWidth: 47,
        },
        3: {
          halign: 'left',
          cellWidth: 25,
        },
        4: {
          halign: 'center',
          cellWidth: 10,
        },
        5: {
          halign: 'center',
          cellWidth: 16,
        },
        6: {
          halign: 'right',
          cellWidth: 20,
        },
        7: {
          halign: 'right',
          cellWidth: 28,
        },
      },
      margin: {
        left: marginLeft,
        right: marginLeft,
        bottom: 34,
      },
      tableWidth: 'wrap',
      didDrawPage: () => {},
    });

    const typedDoc = doc as jsPDF & {
      lastAutoTable: {
        finalY: number;
      };
    };

    currentY = typedDoc.lastAutoTable.finalY + 3;
  }

  const normalTaxes = invoiceTaxes.filter((tax) => !isPphTax(tax));
  const pphTaxes = invoiceTaxes.filter((tax) => isPphTax(tax));

  const estimatedRemainingHeight = 75 + normalTaxes.length * 3.5 + pphTaxes.length * 3;

  if (currentY + estimatedRemainingHeight > footerTop) {
    doc.addPage();
    currentY = 38;
  }

  drawSeparator(doc, currentY);

  currentY += 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('Rincian Perhitungan:', marginLeft, currentY);

  currentY += 4;

  const calcLeft = marginLeft + 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  doc.text('Subtotal', calcLeft, currentY);

  doc.text(formatCurrency(data?.totalAmount), rightX, currentY, {
    align: 'right',
  });

  currentY += 3.5;

  normalTaxes.forEach((tax) => {
    doc.text(`+ ${safeText(tax?.taxType)}`, calcLeft, currentY);

    doc.text(formatCurrency(tax?.taxAmount), rightX, currentY, {
      align: 'right',
    });

    currentY += 3.5;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('Total Tagihan', calcLeft, currentY);

  doc.text(formatCurrency(data?.amountWithTax), rightX, currentY, {
    align: 'right',
  });

  currentY += 3.5;

  if (pphTaxes.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    pphTaxes.forEach((tax) => {
      const taxValue = safeNumber(tax?.taxValue);
      const percentage = taxValue > 0 ? ` (${taxValue * 100}%)` : '';

      doc.text(`(-) ${safeText(tax?.taxType)}${percentage}`, calcLeft, currentY);

      doc.text(formatCurrency(tax?.taxAmount), rightX, currentY, {
        align: 'right',
      });

      currentY += 3;
    });
  }

  currentY += 1;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  const terbilangText = `Terbilang: ${terbilangRupiah(safeNumber(data?.amountWithTax))}`;
  const terbilangLines = doc.splitTextToSize(terbilangText, pageWidth - marginLeft * 2);

  doc.text(terbilangLines, marginLeft, currentY);

  currentY += terbilangLines.length * 3 + 2.5;

  drawSeparator(doc, currentY);

  currentY += 3;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  doc.text('Pembayaran :', marginLeft, currentY);

  currentY += 3;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  doc.text(
    'Silakan lakukan pembayaran ke rekening berikut atas nama perusahaan kami:',
    marginLeft,
    currentY
  );

  currentY += 2.5;

  const bankName = safeText(data?.BankAccount?.bankName);
  const bankAccountNumber = safeText(data?.BankAccount?.bankAccountNumber);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  doc.text(`PT Industri Karet Nusantara (${bankName})`, marginLeft, currentY);

  currentY += 2.5;

  doc.text(`No. Rekening: ${bankAccountNumber}`, marginLeft, currentY);

  currentY += 5;

  const signatureBoxWidth = 70;
  const signatureBoxHeight = 35;
  const signatureX = pageWidth - marginLeft - signatureBoxWidth;

  if (currentY + signatureBoxHeight > footerTop) {
    doc.addPage();
    currentY = 38;
  }

  const signatureY = currentY;

  doc.setDrawColor(255);
  doc.rect(signatureX, signatureY, signatureBoxWidth, signatureBoxHeight, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  doc.text('PT INDUSTRI KARET NUSANTARA', signatureX + signatureBoxWidth / 2, signatureY + 2, {
    align: 'center',
  });

  const namaAtasan = safeText(data?.namaAtasan);
  const jabatanAtasan = safeText(data?.jabatanAtasan);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  doc.text(namaAtasan, signatureX + signatureBoxWidth / 2, signatureY + 22, {
    align: 'center',
  });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');

  doc.text(jabatanAtasan, signatureX + signatureBoxWidth / 2, signatureY + 26, {
    align: 'center',
  });

  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    drawInvoiceFooter(doc);
  }

  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);

  window.open(url, '_blank');
}
