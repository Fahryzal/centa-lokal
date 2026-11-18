export const all = [
  'Administrator',
  'admin_gudang',
  'admin_keuangan',
  'admin_pemasaran',
  'admin_akuntansi',

  'manager_gudang',
  'manager_keuangan',
  'manager_akuntansi',
  'manager_pemasaran',
];

export const kategori = ['Administrator'];
export const unit = ['Administrator'];
export const satuan = ['Administrator'];
export const userManagement = ['Administrator'];
export const customer = ['Administrator'];
export const master = ['Administrator'];
export const administrator = ['Administrator'];

export const salesPlan = ['Administrator', 'admin_pemasaran', 'manager_pemasaran'];
export const pesanan = ['Administrator', 'admin_pemasaran', 'manager_pemasaran'];
export const pengirimanBarang = ['Administrator', 'admin_pemasaran', 'manager_pemasaran'];
export const invoice = ['Administrator', 'admin_pemasaran', 'manager_pemasaran'];

export const pajak = ['Administrator', 'admin_keuangan', 'manager_keuangan'];
export const pembayaran = ['Administrator', 'admin_keuangan', 'manager_keuangan'];
export const jurnal = ['Administrator', 'admin_keuangan', 'manager_keuangan'];

export const barangMentah = ['Administrator', 'admin_gudang', 'manager_gudang'];
export const barangJadi = ['Administrator', 'admin_gudang', 'manager_gudang'];

export const spb = ['Administrator', 'admin_akuntansi', 'manager_akuntansi'];

export const paymentOptions = [
  { label: 'Pembayaran DP dan  Pelunasan setelah BL terbit', value: 'DOWNPAYMENT' },
  {
    label: 'Pembayaran Full Setelah PI Terbit (bayar di awal)',
    value: 'FULLPAYMENT_BEFORE_INVOICE',
  },
  { label: 'Pembayaran dengan LC', value: 'FULLPAYMENT_AFTER_INVOICE' },
  { label: 'Lain-lain', value: 'OTHER' },
];

export const incotermsOptions = [
  {
    label: 'CIF',
    value: 'CIF',
  },
  {
    label: 'FOB',
    value: 'FOB',
  },
];
