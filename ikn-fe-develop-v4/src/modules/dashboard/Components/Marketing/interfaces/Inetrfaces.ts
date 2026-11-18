export interface ParamsTypeMarketing {
  year?: number;
  month?: string;
  productName?: string;
  unitId?: string;
}

export interface ParamsTypeInvoice {
  year?: number;
  month?: number;
  unitId?: string;
  typePo?: 'RA' | 'RN' | 'RN_EKSPOR';
}
export interface ParamsTypeSalesPlan {
  year?: number;
  unitId?: string;
  typePo?: 'RA' | 'RN' | 'RN_EKSPOR';
}

export interface ParamsTypeBuyer {
  year?: number | string;
  unitId?: string;
  typePo?: 'RA' | 'RN' | 'RN_EKSPOR';
  namaBarang?: string;
  customerName?: string;
  month?: number | string;
}
