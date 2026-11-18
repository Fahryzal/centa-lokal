import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Account = {
  accountCode: string;
  accountName: string;
  neracaAwal: { debit: number; credit: number };
  saldoAwal: { debit: number; credit: number };
  mutasi: { debit: number; credit: number };
  saldoAkhir: { debit: number; credit: number };
};

function mergeAccounts(data: any): Account[] {
  return data.flatMap((group: any) => group.accounts);
}

export function exportTrialBalanceToExcel(data: any, unitName: string, period: string) {
  const accounts = mergeAccounts(data);

  // =========================
  // GROUPING BY PREFIX
  // =========================
  const grouped: Record<string, Account[]> = {};
  accounts.forEach((row) => {
    const prefix = row.accountCode.split('.')[0];
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(row);
  });

  // =========================
  // HEADER ROW
  // =========================
  const rows: any[][] = [
    [`PT. INDUSTRI KARET NUSANTARA`],
    [`NERACA PERCOBAAN — UNIT ${unitName}`],
    [`PERIODE: ${period}`],
    [],
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
  ];

  // =========================
  // TOTAL AKUMULATOR
  // =========================
  const overallTotals = {
    neracaAwal: { debit: 0, credit: 0 },
    saldoAwal: { debit: 0, credit: 0 },
    mutasi: { debit: 0, credit: 0 },
    saldoAkhir: { debit: 0, credit: 0 },
  };

  // =========================
  // DATA ROWS
  // =========================
  Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((prefix) => {
      const groupTotals = {
        neracaAwal: { debit: 0, credit: 0 },
        saldoAwal: { debit: 0, credit: 0 },
        mutasi: { debit: 0, credit: 0 },
        saldoAkhir: { debit: 0, credit: 0 },
      };

      grouped[prefix].forEach((row) => {
        groupTotals.neracaAwal.debit += row.neracaAwal.debit;
        groupTotals.neracaAwal.credit += row.neracaAwal.credit;
        groupTotals.saldoAwal.debit += row.saldoAwal.debit;
        groupTotals.saldoAwal.credit += row.saldoAwal.credit;
        groupTotals.mutasi.debit += row.mutasi.debit;
        groupTotals.mutasi.credit += row.mutasi.credit;
        groupTotals.saldoAkhir.debit += row.saldoAkhir.debit;
        groupTotals.saldoAkhir.credit += row.saldoAkhir.credit;

        overallTotals.neracaAwal.debit += row.neracaAwal.debit;
        overallTotals.neracaAwal.credit += row.neracaAwal.credit;
        overallTotals.saldoAwal.debit += row.saldoAwal.debit;
        overallTotals.saldoAwal.credit += row.saldoAwal.credit;
        overallTotals.mutasi.debit += row.mutasi.debit;
        overallTotals.mutasi.credit += row.mutasi.credit;
        overallTotals.saldoAkhir.debit += row.saldoAkhir.debit;
        overallTotals.saldoAkhir.credit += row.saldoAkhir.credit;

        rows.push([
          row.accountCode,
          row.accountName,
          row.neracaAwal.debit,
          row.neracaAwal.credit,
          row.saldoAwal.debit,
          row.saldoAwal.credit,
          row.mutasi.debit,
          row.mutasi.credit,
          row.saldoAkhir.debit,
          row.saldoAkhir.credit,
        ]);
      });

      // TOTAL PER GROUP
      rows.push([
        '',
        'TOTAL',
        groupTotals.neracaAwal.debit,
        groupTotals.neracaAwal.credit,
        groupTotals.saldoAwal.debit,
        groupTotals.saldoAwal.credit,
        groupTotals.mutasi.debit,
        groupTotals.mutasi.credit,
        groupTotals.saldoAkhir.debit,
        groupTotals.saldoAkhir.credit,
      ]);
    });

  // =========================
  // GRAND TOTAL
  // =========================
  rows.push([
    '',
    'GRAND TOTAL',
    overallTotals.neracaAwal.debit,
    overallTotals.neracaAwal.credit,
    overallTotals.saldoAwal.debit,
    overallTotals.saldoAwal.credit,
    overallTotals.mutasi.debit,
    overallTotals.mutasi.credit,
    overallTotals.saldoAkhir.debit,
    overallTotals.saldoAkhir.credit,
  ]);

  // =========================
  // CREATE WORKBOOK
  // =========================
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Auto width kolom
  worksheet['!cols'] = [
    { wch: 18 },
    { wch: 40 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Neraca Percobaan');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  saveAs(
    new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    `Neraca_Percobaan_${unitName}_${period}.xlsx`
  );
}
