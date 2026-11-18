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

type GroupTotals = {
  group: string;
  neracaAwal: { debit: number; credit: number };
  saldoAwal: { debit: number; credit: number };
  mutasi: { debit: number; credit: number };
  saldoAkhir: { debit: number; credit: number };
};

function mergeAccounts(data: any): Account[] {
  return data.flatMap((group: any) => group.accounts);
}

export function exportTrialBalanceToPDF(data: any, unitName: string, period: string) {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header function
  const addHeader = () => {
    doc.setFontSize(14);
    doc.text('PT. INDUSTRI KARET NUSANTARA', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`NERACA PERCOBAAN — UNIT ${unitName.toUpperCase()}`, pageWidth / 2, 22, {
      align: 'center',
    });
    doc.text(`PERIODE: ${period}`, pageWidth / 2, 29, { align: 'center' });
  };

  addHeader();
  const startY = 40;

  // Calculate totals per group
  const accounts = mergeAccounts(data);
  const grouped: { [key: string]: Account[] } = accounts.reduce(
    (acc: { [key: string]: Account[] }, row: Account) => {
      const prefix = row.accountCode.split('.')[0]; // Get prefix (e.g., "08")
      if (!acc[prefix]) {
        acc[prefix] = [];
      }
      acc[prefix].push(row);
      return acc;
    },
    {}
  );

  const groupTotals: { [key: string]: GroupTotals } = {};
  Object.keys(grouped).forEach((prefix) => {
    groupTotals[prefix] = {
      group: prefix,
      neracaAwal: { debit: 0, credit: 0 },
      saldoAwal: { debit: 0, credit: 0 },
      mutasi: { debit: 0, credit: 0 },
      saldoAkhir: { debit: 0, credit: 0 },
    };
    grouped[prefix].forEach((row) => {
      groupTotals[prefix].neracaAwal.debit += row.neracaAwal.debit;
      groupTotals[prefix].neracaAwal.credit += row.neracaAwal.credit;
      groupTotals[prefix].saldoAwal.debit += row.saldoAwal.debit;
      groupTotals[prefix].saldoAwal.credit += row.saldoAwal.credit;
      groupTotals[prefix].mutasi.debit += row.mutasi.debit;
      groupTotals[prefix].mutasi.credit += row.mutasi.credit;
      groupTotals[prefix].saldoAkhir.debit += row.saldoAkhir.debit;
      groupTotals[prefix].saldoAkhir.credit += row.saldoAkhir.credit;
    });
  });

  // Overall totals
  const overallTotals = {
    neracaAwal: { debit: 0, credit: 0 },
    saldoAwal: { debit: 0, credit: 0 },
    mutasi: { debit: 0, credit: 0 },
    saldoAkhir: { debit: 0, credit: 0 },
  };

  // Prepare table data with group totals
  const tableData: any[] = [];
  Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((prefix) => {
      // Add individual accounts for the group
      grouped[prefix].forEach((row) => {
        overallTotals.neracaAwal.debit += row.neracaAwal.debit;
        overallTotals.neracaAwal.credit += row.neracaAwal.credit;
        overallTotals.saldoAwal.debit += row.saldoAwal.debit;
        overallTotals.saldoAwal.credit += row.saldoAwal.credit;
        overallTotals.mutasi.debit += row.mutasi.debit;
        overallTotals.mutasi.credit += row.mutasi.credit;
        overallTotals.saldoAkhir.debit += row.saldoAkhir.debit;
        overallTotals.saldoAkhir.credit += row.saldoAkhir.credit;

        tableData.push([
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
        ]);
      });

      // Add group total row
      const totals = groupTotals[prefix];
      tableData.push([
        '',
        `TOTAL`,
        totals.neracaAwal.debit.toLocaleString(),
        totals.neracaAwal.credit.toLocaleString(),
        totals.saldoAwal.debit.toLocaleString(),
        totals.saldoAwal.credit.toLocaleString(),
        totals.mutasi.debit.toLocaleString(),
        totals.mutasi.credit.toLocaleString(),
        totals.saldoAkhir.debit.toLocaleString(),
        totals.saldoAkhir.credit.toLocaleString(),
      ]);
    });

  // Add overall total row
  tableData.push([
    '',
    'GRAND TOTAL',
    overallTotals.neracaAwal.debit.toLocaleString(),
    overallTotals.neracaAwal.credit.toLocaleString(),
    overallTotals.saldoAwal.debit.toLocaleString(),
    overallTotals.saldoAwal.credit.toLocaleString(),
    overallTotals.mutasi.debit.toLocaleString(),
    overallTotals.mutasi.credit.toLocaleString(),
    overallTotals.saldoAkhir.debit.toLocaleString(),
    overallTotals.saldoAkhir.credit.toLocaleString(),
  ]);
  // Generate table
  autoTable(doc, {
    startY: startY,
    margin: { top: 40 },
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
    showHead: 'firstPage',
    styles: { fontSize: 8, halign: 'right' },
    headStyles: { fillColor: [0, 112, 192], halign: 'center' },
    footStyles: { fillColor: [220, 220, 220] },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'left' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
    },
    didDrawPage: (data: any) => {
      addHeader();
      data.settings.startY = 40;
      data.settings.showHead = 'everyPage';
    },
  });

  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
}
