import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Account = {
  accountCode: string;
  accountName: string;
  neracaAwal: { debit: number; credit: number };
  saldoAwal: { debit: number; credit: number };
  mutasi: { debit: number; credit: number };
  saldoAkhir: { debit: number; credit: number };
};

type Group = {
  group: string;
  accounts: Account[];
  neracaAwal: { debit: number; credit: number };
  saldoAwal: { debit: number; credit: number };
  mutasi: { debit: number; credit: number };
  saldoAkhir: { debit: number; credit: number };
};

function mergeAccounts(data: Group[]): Account[] {
  return data.flatMap((group) => group.accounts);
}

export function exportTrialBalanceToPDF(data: any, unitName: string, period: string) {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth(); // Lebar halaman (297 mm untuk A4 landscape)
  // Fungsi untuk menambahkan judul
  const addHeader = () => {
    doc.setFontSize(14);
    doc.text('PT. INDUSTRI KARET NUSANTARA', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`NERACA PERCOBAAN — UNIT ${unitName.toUpperCase()}`, pageWidth / 2, 22, {
      align: 'center',
    });
    doc.text(`PERIODE: ${period}`, pageWidth / 2, 29, { align: 'center' });
  };

  // Tambahkan judul di halaman pertama
  addHeader();

  let startY = 40; // Posisi awal untuk tabel di halaman pertama

  // Hitung total per group
  const totals = {
    neracaAwal: { debit: 0, credit: 0 },
    saldoAwal: { debit: 0, credit: 0 },
    mutasi: { debit: 0, credit: 0 },
    saldoAkhir: { debit: 0, credit: 0 },
  };

  const tableData = mergeAccounts(data).map((row: any) => {
    totals.neracaAwal.debit += row.neracaAwal.debit;
    totals.neracaAwal.credit += row.neracaAwal.credit;
    totals.saldoAwal.debit += row.saldoAwal.debit;
    totals.saldoAwal.credit += row.saldoAwal.credit;
    totals.mutasi.debit += row.mutasi.debit;
    totals.mutasi.credit += row.mutasi.credit;
    totals.saldoAkhir.debit += row.saldoAkhir.debit;
    totals.saldoAkhir.credit += row.saldoAkhir.credit;

    return [
      row.accountCode,
      row.accountName,
      row.neracaAwal.debit.toLocaleString(),
      row.neracaAwal.credit.toLocaleString(),
      row.saldoAwal.debit.toLocaleString(),
      row.saldoAwal.credit.toLocaleString(),
      row.mutasi.debit.toLocaleString(),
      row.mutasi.credit.toLocaleString(),
      row.saldoAkhir.debit.toLocaleString(),
      row.saldoAkhir.credit.toLocaleString(),
    ];
  });

  // Tambahkan baris total
  tableData.push([
    '',
    'TOTAL',
    totals.neracaAwal.debit.toLocaleString(),
    totals.neracaAwal.credit.toLocaleString(),
    totals.saldoAwal.debit.toLocaleString(),
    totals.saldoAwal.credit.toLocaleString(),
    totals.mutasi.debit.toLocaleString(),
    totals.mutasi.credit.toLocaleString(),
    totals.saldoAkhir.debit.toLocaleString(),
    totals.saldoAkhir.credit.toLocaleString(),
  ]);

  autoTable(doc, {
    startY: startY,
    margin: { top: 40 }, // Pastikan tabel dimulai di bawah judul
    head: [
      [
        'Kode Rekening',
        'Nama Rekening',
        'Neraca Awal (D)',
        'Neraca Awal (K)',
        'Saldo Awal (D)',
        'Saldo Awal (K)',
        'Mutasi (D)',
        'Mutasi (K)',
        'Saldo Akhir (D)',
        'Saldo Akhir (K)',
      ],
    ],
    body: tableData,
    showHead: 'firstPage', // Header tabel hanya muncul di halaman pertama grup
    styles: {
      fontSize: 8,
      halign: 'right', // Rata kanan untuk kolom numerik
    },
    headStyles: {
      fillColor: [0, 112, 192],
      halign: 'center', // Rata tengah untuk header tabel
    },
    footStyles: {
      fillColor: [220, 220, 220],
    },
    columnStyles: {
      0: { halign: 'left' }, // Kode Rekening rata kiri
      1: { halign: 'left' }, // Nama Rekening rata kiri
      2: { halign: 'right' }, // Neraca Awal (D)
      3: { halign: 'right' }, // Neraca Awal (K)
      4: { halign: 'right' }, // Saldo Awal (D)
      5: { halign: 'right' }, // Saldo Awal (K)
      6: { halign: 'right' }, // Mutasi (D)
      7: { halign: 'right' }, // Mutasi (K)
      8: { halign: 'right' }, // Saldo Akhir (D)
      9: { halign: 'right' }, // Saldo Akhir (K)
    },
    didDrawPage: (data: any) => {
      // Tambahkan judul di setiap halaman baru
      addHeader();
      // Atur ulang startY untuk tabel berikutnya agar tidak tumpang tindih
      data.settings.startY = 40; // Mulai tabel di bawah judul (setelah y=29 + margin)
      // Pastikan header tabel muncul di halaman baru
      data.settings.showHead = 'everyPage'; // Aktifkan header tabel di halaman baru
    },
  });

  startY = (doc as any).lastAutoTable.finalY + 15; // Geser posisi ke bawah untuk grup berikutnya

  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
}
