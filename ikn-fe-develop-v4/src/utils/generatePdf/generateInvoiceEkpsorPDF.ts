import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceData {
  invoiceNumber: string;
  purchaseOrder: string;
  proformaInvoiceNumber: string;
  date: string;
  vesselName: string;
  sailingDate: string;
  loadingPort: string;
  destination: string;
  buyer: {
    name: string;
    address: string;
    tel: string;
    fax: string;
  };
  product: {
    description: string;
    quantity: string;
    packing: string;
    batchInfo: {
      palletNo: string;
      batchNo: string;
      bags: number;
      weight: string;
    }[];
  };
  amounts: {
    total: number;
    insurance: number;
    freight: number;
    cif: number;
  };
}

export const generateInvoiceEkpsorPDF = async () => {
  // Sample data - replace with your actual data
  const invoiceData: InvoiceData = {
    invoiceNumber: 'IKN.PPN/INV/PRPNE/007/2025',
    purchaseOrder: 'CR250218',
    proformaInvoiceNumber: 'IKN.PPN/PINV/PRPNE/007/2025',
    date: '18-Feb-25',
    vesselName: '',
    sailingDate: '2-Mar-25',
    loadingPort: '',
    destination: 'SHANGHAI, CHINA',
    buyer: {
      name: 'SHANGHAI RECKY INTERNATIONAL TRADING CO., LTD',
      address: 'ROOM 2301, NO. 53, LANE 100, SHUNYI ROAD, SHANGHAI CHINA 200063',
      tel: '0086-021-64231355',
      fax: '0086-021-52350473',
    },
    product: {
      description: 'RESIPRENE 35 MADE FROM NATURAL RUBBER CYCLIZED RUBBER',
      quantity: '2500 KGS RESIPRENE 35 - PO NO.CR250218',
      packing: '25 KGS-BAGS ON 1000 KGS/ PALLET',
      batchInfo: [
        { palletNo: '016', batchNo: '0120125 - 0130125', bags: 40, weight: '1.000,00' },
        { palletNo: '022', batchNo: '0170125 - 0190125', bags: 40, weight: '1.000,00' },
        { palletNo: '028', batchNo: '0250225', bags: 20, weight: '500,00' },
      ],
    },
    amounts: {
      total: 21250.0,
      insurance: 20610.94,
      freight: 35.06,
      cif: 604.0,
    },
  };

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Set font styles
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Company header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PT INDUSTRI KARET NUSANTARA', 105, 15, { align: 'center' });
  doc.text('(NUSANTARA RUBBER INDUSTRY)', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Jl. Medan – Tg. Morawa Km. 9,5 Medan 20148', 105, 25, { align: 'center' });
  doc.text('Telp. (061) 7867356 – 7867357', 105, 30, { align: 'center' });
  doc.text('Email: gpink_ppme@ikn.co.id; info@ikn.co.id; gpink_ppme@hotmail.com', 105, 35, {
    align: 'center',
  });

  // Divider line
  doc.line(10, 40, 200, 40);

  // Invoice title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('I N V O I C E', 105, 48, { align: 'center' });

  // Invoice details table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const leftX = 10;
  const labelRightX = 120;
  const valueLeftX = 60;
  const valueRightX = 165;
  let y = 55;
  const lineHeight = 5;

  // Helper untuk membungkus teks panjang
  const wrapText = (text: string, maxWidth: number) => doc.splitTextToSize(text, maxWidth);

  // 1. Buyer Name
  doc.text('Sold By Order and For Account and Risk Of Messrs,', leftX, y);
  // Bungkus label + value jadi dua baris kalau kepanjangan
  const invoiceNoLabelLines = wrapText('Invoice No.', 35);
  const invoiceNoValueLines = wrapText(invoiceData.invoiceNumber, 100);

  invoiceNoLabelLines.forEach((line: any, i: number) => {
    doc.text(line, labelRightX, y + i * lineHeight);
  });
  invoiceNoValueLines.forEach((line: any, i: number) => {
    doc.text(`: ${line}`, valueRightX - 18, y + i * lineHeight, { align: 'left' });
  });

  y += Math.max(invoiceNoLabelLines.length, invoiceNoValueLines.length) * lineHeight;

  y += lineHeight;
  const buyerNameLines = wrapText(invoiceData.buyer.name, 100);
  buyerNameLines.forEach((line: any) => {
    doc.text(line, leftX, y);
    y += lineHeight;
  });
  doc.text('Purchase Order', labelRightX, y - lineHeight * buyerNameLines.length);
  doc.text(
    `: ${invoiceData.purchaseOrder}`,
    valueRightX - 18,
    y - lineHeight * buyerNameLines.length,
    {
      align: 'left',
    }
  );

  // 2. Buyer Address
  const buyerAddressLines = wrapText(invoiceData.buyer.address, 100);
  buyerAddressLines.forEach((line: any) => {
    doc.text(line, leftX, y);
    y += lineHeight;
  });
  const proformaLabelLines = wrapText('As Per Proforma Invoice No.', 35);
  const proformaValueLines = wrapText(invoiceData.proformaInvoiceNumber, 100);
  const proformaY = y - lineHeight * buyerAddressLines.length;

  proformaLabelLines.forEach((line: any, i: number) => {
    doc.text(line, labelRightX, proformaY + i * lineHeight);
  });
  proformaValueLines.forEach((line: any, i: number) => {
    doc.text(`: ${line}`, valueRightX - 18, proformaY + i * lineHeight, { align: 'left' });
  });

  const maxLineCount = Math.max(proformaLabelLines.length, proformaValueLines.length);
  y = Math.max(y, proformaY + maxLineCount * lineHeight);

  // 3. Contact
  const contactLine = `TEL : ${invoiceData.buyer.tel}   FAX : ${invoiceData.buyer.fax}`;
  doc.text(contactLine, leftX, y);
  doc.text('D A T E', labelRightX, y);
  doc.text(`: ${invoiceData.date}`, valueRightX - 18, y);
  y += lineHeight + 5;

  // 4. Shipping
  doc.text('Name Of Vessel :', leftX, y);
  doc.text(invoiceData.vesselName || '-', valueLeftX, y);
  doc.text('Sailing Date', labelRightX, y);
  doc.text(`: ${invoiceData.sailingDate}`, valueRightX - 18, y);
  y += lineHeight;

  doc.text('Loading Port :', leftX, y);
  doc.text(invoiceData.loadingPort || '-', valueLeftX, y);
  doc.text('Final Destination', labelRightX, y);
  doc.text(`: ${invoiceData.destination}`, valueRightX - 18, y);
  y += lineHeight;

  doc.text('L/C No :', leftX, y);
  doc.text('-', valueLeftX, y);
  doc.text('D A T E', labelRightX, y);
  doc.text(': -', valueRightX - 18, y);
  y += lineHeight;

  doc.text('Issued By Bank :', leftX, y);
  doc.text('-', valueLeftX, y);

  y += 5;
  autoTable(doc, {
    startY: y,
    margin: { left: 10 }, // 👈 Geser tabel ke kiri (default biasanya 20)
    head: [
      [
        'PALLET NO.',
        'BATCH NO.',
        'BAGS / PALLET',
        'NETT WEIGHT (KGS)',
        'UNIT PRICE ( USD ) ',
        'AMOUNT( USD )',
      ],
    ],
    body: invoiceData.product.batchInfo.map((batch) => [
      batch.palletNo,
      batch.batchNo,
      batch.bags.toString(),
      batch.weight,
      'USD 100',
      'USD 100',
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 25 }, // PALLET NO.
      1: { cellWidth: 40 }, // BATCH NO.
      2: { cellWidth: 30 }, // BAGS / PALLET
      3: { cellWidth: 35 }, // NETT WEIGHT
      4: { cellWidth: 30 }, // UNIT PRICE
      5: { cellWidth: 30 }, // AMOUNT
    },

    headStyles: {
      fillColor: [255, 255, 255], // header background putih
      textColor: 0, // teks hitam
      fontStyle: 'bold',
      lineWidth: 0.1, // garis tipis (default)
      lineColor: 0, // warna garis hitam
    },
    theme: 'grid',
  });

  // Buat tabel utama
  y += 40;
  autoTable(doc, {
    startY: y,
    margin: { left: 10 }, // 👈 Geser tabel ke kiri (default biasanya 20)
    head: [['MARKS & NOS', 'DESCRIPTION & QUANTITY', 'UNIT PRICE (USD)', 'AMOUNT (USD)']],
    body: [
      ['016', 'LCL S.T.C. 3 PALLETS = 100 BAGS', '', ''],
      ['022', invoiceData.product.description, '', ''],
      ['028', invoiceData.product.quantity, '', ''],
      ['', 'CYCLIZED RUBBER', '', ''],
      ['', `PACKING: ${invoiceData.product.packing}`, '', ''],
      ['', 'PT. IKN NORTH SUMATERA INDONESIA', '', ''],
      ['', `AS PER PROFORMA INVOICE NO. ${invoiceData.proformaInvoiceNumber}`, '', ''],
      ['', `DATED ${invoiceData.date.replace('-', ' ')}`, '', ''],
      [
        '',
        '',
        `\n FOB \n \n INSURANCE \n \n FREIGHT \n \n`,

        `
    ${invoiceData.amounts.total.toFixed(2)}\n
    ${invoiceData.amounts.insurance.toFixed(2)}\n
    ${invoiceData.amounts.freight.toFixed(2)}\n`,
      ],
      ['', 'FREIGHT PREPAID', 'CIF SHANGHAI', invoiceData.amounts.total.toFixed(2)],
      [
        '',
        '',
        {
          content: '(IN USD: TWENTY ONE THOUSAND TWO)',
          colSpan: 2,
          styles: { halign: 'center' },
        },
      ],
    ],
    styles: {
      fontSize: 9,
      cellPadding: 2,
      valign: 'top',
    },
    didParseCell: function (data) {
      const { column, cell, row }: any = data;

      if (column.index === 1 && row.raw[1] === 'FREIGHT PREPAID') {
        cell.styles.halign = 'center';
      }
    },
    columnStyles: {
      0: { cellWidth: 25 }, // MARKS &NOS
      1: { cellWidth: 85 }, // DESCRIPTION & QUANTITY
      2: { cellWidth: 40 }, // UNIT PRICE(USD)
      3: { cellWidth: 40 }, // AMOUNT(USD)
    },
    headStyles: {
      fillColor: [255, 255, 255], // header background putih
      textColor: 0, // teks hitam
      fontStyle: 'bold',
      lineWidth: 0.1, // garis tipis (default)
      lineColor: 0, // warna garis hitam
    },
    theme: 'grid',
  });

  // Amount in words
  // doc.text(`(IN USD: TWENTY ONE THOUSAND TWO HUNDRED AND FIFTY ONLY)`, 10, 220);
  // Show PDF
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
};
