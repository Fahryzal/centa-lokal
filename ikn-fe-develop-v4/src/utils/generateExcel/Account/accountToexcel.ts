import * as XLSX from 'xlsx';

interface AccountType {
  id: string;
  name: string;
  code: string;
  normalBalance: 'DEBIT' | 'CREDIT';
  description: string;
}

interface Account {
  id: string;
  code: string;
  name: string;
  parentName: string;
  parentId: string;
  isLocked: 'Y' | 'N';
  typeNeraca: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  staffId: string;
  accountType: AccountType;
}

export const exportAccountToExcel = (data: Account[]) => {
  const rows = data.map((item) => ({
    ID: item.id,
    'Kode Akun': item.code,
    'Nama Akun': item.name,
    'Parent Akun': item.parentName,
    'Parent ID': item.parentId,
    'Tipe Akun': item.accountType.name,
    'Normal Balance': item.accountType.normalBalance,
    'Deskripsi Tipe': item.accountType.description,
    'Is Locked': item.isLocked,
    'Tipe Neraca': item.typeNeraca,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Account');

  XLSX.writeFile(wb, 'account_export.xlsx');
};
