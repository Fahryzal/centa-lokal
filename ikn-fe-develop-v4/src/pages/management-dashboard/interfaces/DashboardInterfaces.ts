export interface MarketingSummaryResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  data: MarketingSummaryData;
}

export interface PurchaseOrderData {
  total: {
    count: number;
    totalAmount: string | number;
  };
  approved: {
    count: number;
    totalAmount: string | number;
  };
}

export interface InvoiceData {
  total: {
    count: number;
    totalAmount: number | string;
  };
  lunas: {
    count: number;
    totalAmount: number | string;
  };
}

export interface MarketingSummaryData {
  purchaseOrder: PurchaseOrderData;
  purchaseOrderRn: PurchaseOrderData;
  purchaseOrderRnEkspor: PurchaseOrderData;
  spb: {
    countRa: number;
    countRn: number;
    countRnEkspor: number;
  };
  invoiceLokalRA: InvoiceData;
  invoiceLokalRN: InvoiceData;
  invoiceEkspor: InvoiceData;
  customer: {
    count: number;
  };
  salesPlanVsActualRA: {
    plan: string | number;
    actual: number;
  };
  salesPlanVsActualRN: {
    plan: number;
    actual: number;
  };
  salesPlanVsActualRNEkspor: {
    plan: number;
    actual: number;
  };
}

export interface AkuntansiSummaryResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  data: AkuntansiSummaryData;
}

export interface AkuntansiSummaryData {
  cashFlowToday: {
    in: number;
    out: number;
  };
  expenseSummary: Array<{
    accountCode: string;
    category: string;
    parentId: string | null;
    value: number;
    year: string;
  }>;
  bankBalances: Array<{
    bankName: string;
    balance: number;
    month: string;
    year: string;
  }>;
}

export interface WarehouseSummaryResponse {
  success: boolean;
  status: number;
  message: string;
  timestamp: string;
  data: WarehouseSummaryData;
}

export interface WarehouseSummaryData {
  sku: {
    finishedGood: number;
    rawMaterial: any[];
  };
  stockMovementToday: {
    finishedGood: {
      byUnit: Array<{
        unitName: string;
        in: number;
        out: number;
      }>;
    };
    rawMaterial: {
      byUnit: Array<{
        unitName: string;
        in: number;
        out: number;
      }>;
    };
  };
  deliveryOrder: {
    byUnit: Array<{
      unitName: string;
      selected: number;
      total: number;
    }>;
  };
}
