import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface JournalEntry {
  referenceNumber: string | null;
  numberJurnal: string | null;
  journalId: string;
  date: string;
  description: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  kodeAccount: string;
}

export function generateJournalPDF(data: JournalEntry[], jenisJurnal: string) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  {
    if (jenisJurnal.toLocaleLowerCase() === 'all') {
      doc.text('Jurnal Umum', 14, 15);
    }

    if (jenisJurnal.toLocaleLowerCase() === 'penjualan') {
      doc.text('Jurnal Penjualan', 14, 15);
    }

    if (jenisJurnal.toLocaleLowerCase() === 'penerimaan') {
      doc.text('Jurnal Kas', 14, 15);
    }
  }
  doc.setFontSize(10);

  // Group by journalId
  const grouped = data.reduce<Record<string, JournalEntry[]>>((acc, item) => {
    if (!acc[item.journalId]) acc[item.journalId] = [];
    acc[item.journalId].push(item);
    return acc;
  }, {});

  let startY = 25;

  Object.entries(grouped).forEach(([_, entries], index, array) => {
    const { date, numberJurnal, referenceNumber, description } = entries[0];

    doc.text(`Tanggal       : ${new Date(date).toLocaleDateString('id-ID')}`, 14, startY);
    doc.text(`No Jurnal     : ${numberJurnal || '-'}`, 14, startY + 6);
    doc.text(`Referensi     : ${referenceNumber || '-'}`, 14, startY + 12);
    doc.text(`Keterangan    : ${description || '-'}`, 14, startY + 18);

    autoTable(doc, {
      startY: startY + 25,
      head: [['Kode Akun', 'Akun', 'Nama Akun', 'Debit', 'Kredit']],
      body: entries.map((e) => [
        e.kodeAccount,
        e.accountCode,
        e.accountName,
        e.debit > 0 ? formatCurrency(e.debit) : '',
        e.credit > 0 ? formatCurrency(e.credit) : '',
      ]),
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;

    if (startY > 250 && index < array.length - 1) {
      doc.addPage();
      startY = 20;
    }
  });

  // Buka di tab baru
  const blobUrl = doc.output('bloburl');
  window.open(blobUrl, '_blank');
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}
