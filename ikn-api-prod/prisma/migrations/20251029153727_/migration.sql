-- CreateEnum
CREATE TYPE "SelectionStatus" AS ENUM ('SELECTED', 'NOT_SELECTED');

-- CreateEnum
CREATE TYPE "StatusTax" AS ENUM ('PENDING', 'REVIEWED', 'APPROVED');

-- CreateEnum
CREATE TYPE "TypeTax" AS ENUM ('VAT_OUT', 'VAT_IN', 'WITHHOLD', 'SALARY', 'FINAL');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "StatusFinance" AS ENUM ('DRAFT', 'VERIFIED', 'POSTED');

-- CreateEnum
CREATE TYPE "NormalBalance" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "Islocked" AS ENUM ('N', 'Y');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('WAITING', 'DELIVERY', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TypePenjualan" AS ENUM ('RA', 'RN', 'RN_EKSPOR', 'RA_EKSPOR', 'null');

-- CreateEnum
CREATE TYPE "CekPajak" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "TypePayment" AS ENUM ('DOWNPAYMENT', 'FULLPAYMENT_BEFORE_INVOICE', 'FULLPAYMENT_AFTER_INVOICE', 'OTHER');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('RUPIAH', 'DOLLAR');

-- CreateEnum
CREATE TYPE "JournalEntryStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CASH_IN', 'CASH_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'CHEQUE_IN', 'CHEQUE_OUT', 'GIRO_IN', 'GIRO_OUT', 'E_WALLET_IN', 'E_WALLET_OUT', 'OTHER_IN', 'OTHER_OUT');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('PPH22', 'PPH23', 'PPH4_2');

-- CreateEnum
CREATE TYPE "SalesPlanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'VERIFED');

-- CreateEnum
CREATE TYPE "ApprovalType" AS ENUM ('SALES_PLAN', 'PURCHASE_ORDER', 'STOCK_REQUEST', 'PRODUCTION', 'JOURNAL_ENTRY', 'PAYMENT_VOUCHER');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DeliveryOrderStatus" AS ENUM ('DRAFT', 'WAITING_FOR_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SPBStatus" AS ENUM ('CREATED', 'VERIFIED', 'APPROVED');

-- CreateEnum
CREATE TYPE "IsCompleteSPB" AS ENUM ('NO', 'YES');

-- CreateEnum
CREATE TYPE "StatusInvoice" AS ENUM ('LUNAS', 'HUTANG');

-- CreateEnum
CREATE TYPE "InventoryType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "ProductionInventoryType" AS ENUM ('RECEIPT_PROD', 'ISSUE_PROD');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('RAW_MATERIAL', 'FINISHED_GOOD');

-- CreateEnum
CREATE TYPE "PengadaanBarang" AS ENUM ('LOKAL', 'DISTRIK', 'KANDIR', 'SEINDUK');

-- CreateEnum
CREATE TYPE "DiPergunakan" AS ENUM ('kebun_sendiri', 'unit_seinduk', 'pihak_ketiga');

-- CreateEnum
CREATE TYPE "Module" AS ENUM ('SALES', 'PURCHASE', 'EXPENSE', 'PRODUCTION', 'PAYMENT', 'RECEIPT', 'ISSUE', 'INVENTORY', 'JOURNAL', 'ASSET', 'TAX', 'FINANCE', 'REPORT', 'USER_MANAGEMENT', 'FINANCE_RN');

-- CreateEnum
CREATE TYPE "TransactionTypeMapping" AS ENUM ('CASH', 'INVOICE', 'CREDIT', 'MATERIAL_RECEIPT', 'MATERIAL_ISSUE', 'PAYMENT', 'PURCHASE_ORDER', 'SALES_ORDER', 'JOURNAL_ENTRY', 'STOCK_ADJUSTMENT', 'PRODUCTION', 'RETURN', 'EXPENSE', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'WRITE_OFF', 'INVOICE_RN', 'TRANSACTON_MIRROR', 'TRANSACTON_DOLLAR');

-- CreateEnum
CREATE TYPE "Incoterms" AS ENUM ('CIF', 'FOB', 'null');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "isPusat" BOOLEAN NOT NULL DEFAULT false,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "nameParent" TEXT,
    "parentId" INTEGER,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canAdd" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","menuId")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "continent" TEXT,
    "regional_type" TEXT NOT NULL,
    "fax" TEXT,
    "staffId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceTax" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxValue" DOUBLE PRECISION NOT NULL,
    "withheldByCustomer" BOOLEAN NOT NULL,
    "isIncludedInPrice" BOOLEAN NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxValue" DOUBLE PRECISION NOT NULL,
    "verifiedById" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceId" TEXT,
    "type" "TypeTax" NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "staffId" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxTypeMap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "position" "Position" NOT NULL,
    "usage" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaxTypeMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "deliveryOrderId" TEXT,
    "fileUrl" TEXT NOT NULL,
    "signedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finance" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountCode" TEXT NOT NULL,
    "status" "StatusFinance" NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT DEFAULT 'BRIV',
    "currency" TEXT NOT NULL,
    "branchAddress" TEXT NOT NULL,
    "currencyRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "bankAccountNumber" TEXT NOT NULL,
    "initialBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staffId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "normalBalance" "NormalBalance" NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentName" TEXT,
    "accountTypeId" TEXT NOT NULL,
    "parentId" TEXT,
    "isLocked" "Islocked" NOT NULL DEFAULT 'N',
    "typeNeraca" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralLedger" (
    "id" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "debitTotal" DECIMAL(65,30) NOT NULL,
    "creditTotal" DECIMAL(65,30) NOT NULL,
    "openingDebit" DECIMAL(65,30) NOT NULL,
    "openingCredit" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unitId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GeneralLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingPeriod" (
    "period" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountingPeriod_pkey" PRIMARY KEY ("period")
);

-- CreateTable
CREATE TABLE "CashFlow" (
    "id" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "staffId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "accountCode" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalCharges" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdditionalCharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "franco" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileUrlKontrak" TEXT,
    "fileUrlEkspor" TEXT,
    "fileUrlProduksi" TEXT,
    "fileUrlBl" TEXT,
    "subtotalAmount" DOUBLE PRECISION NOT NULL,
    "approvedFile" TEXT,
    "customerName" TEXT NOT NULL,
    "incoterms" "Incoterms" NOT NULL DEFAULT 'null',
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'WAITING',
    "typePo" "TypePenjualan" DEFAULT 'null',
    "typePayment" "TypePayment" NOT NULL DEFAULT 'FULLPAYMENT_AFTER_INVOICE',
    "downPayment" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" "CurrencyType" NOT NULL DEFAULT 'RUPIAH',
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "fileUrlSigned" TEXT,
    "selectionStatus" "SelectionStatus" NOT NULL DEFAULT 'NOT_SELECTED',
    "selectionStatusInvoice" "SelectionStatus" NOT NULL DEFAULT 'NOT_SELECTED',
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cekPajak" "CekPajak" NOT NULL DEFAULT 'NO',

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "quantity" INTEGER,
    "orderNumber" TEXT,
    "orderDate" TIMESTAMP(3),
    "total" DOUBLE PRECISION NOT NULL,
    "stockProduct" INTEGER NOT NULL,
    "priceProduct" DOUBLE PRECISION NOT NULL,
    "kodeBarangProduct" TEXT NOT NULL,
    "namabarangProduct" TEXT NOT NULL,
    "namabarangProductInvoice" TEXT NOT NULL,
    "spesifikasiProduct" TEXT NOT NULL,
    "beratproduct" DOUBLE PRECISION NOT NULL,
    "kategoriProduct" TEXT NOT NULL,
    "satuanProduct" TEXT NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unitProduct" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "productId" TEXT NOT NULL,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderTax" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxValue" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "accountCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PurchaseOrderTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "spbId" TEXT,
    "numberJurnal" TEXT,
    "module" TEXT NOT NULL,
    "rawMaterialIssueId" TEXT,
    "rawMaterialReceiptId" TEXT,
    "transactionId" TEXT,
    "description" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "isPosted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currencyValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unitId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "journalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeJournalEntry" "TypePenjualan" DEFAULT 'null',
    "status" "JournalEntryStatus" NOT NULL DEFAULT 'DRAFT',
    "is_intercompany" BOOLEAN NOT NULL DEFAULT false,
    "intercompanyReference" TEXT,
    "purchaseOrderTaxId" TEXT,
    "sPBTaxId" TEXT,
    "currency" "CurrencyType" NOT NULL DEFAULT 'RUPIAH',
    "staffId" TEXT NOT NULL,
    "totalBalance" DECIMAL(65,30),
    "totalBalanceUs" DECIMAL(65,30),

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntryDetail" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "unitId" TEXT,
    "fixedAssetId" TEXT,
    "accountCode" TEXT NOT NULL,
    "debit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "credit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "isTmp" BOOLEAN NOT NULL DEFAULT false,
    "debitDollar" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "creditDollar" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntryDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receivable" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receivable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payable" (
    "id" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashBankTransaction" (
    "id" TEXT NOT NULL,
    "transactionNumber" TEXT NOT NULL,
    "amountOriginal" DOUBLE PRECISION NOT NULL,
    "amountInIDR" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "exchangeRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "accounIdTax" TEXT,
    "grossAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "administrasiAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "type" "TransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kategori" TEXT,
    "to" TEXT,
    "address" TEXT,
    "isMaterial" TEXT NOT NULL DEFAULT 'N',
    "taxType" TEXT,
    "taxValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unitId" TEXT NOT NULL,
    "accountCode" TEXT,
    "invoiceId" TEXT,
    "invoiceEksporId" TEXT,
    "bank_account_id" TEXT,
    "staffId" TEXT NOT NULL,
    "typeTransaction" "TypePenjualan" DEFAULT 'null',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashBankTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithholdingTax" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "type" "TaxType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithholdingTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesPlan" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "value_rkap" DECIMAL(65,30) NOT NULL,
    "unitId" TEXT NOT NULL,
    "periode_month" TEXT NOT NULL,
    "status" "SalesPlanStatus" NOT NULL DEFAULT 'PENDING',
    "typeSalesPlan" "TypePenjualan" DEFAULT 'null',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxReport" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "verifiedById" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "requestType" "ApprovalType" NOT NULL,
    "referenceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "approvedById" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryOrder" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "au58Id" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "typeSalesDelivery" "TypePenjualan" DEFAULT 'null',
    "staffId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "status" "DeliveryOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "selectionStatus" "SelectionStatus" NOT NULL DEFAULT 'NOT_SELECTED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockRequest" (
    "id" TEXT NOT NULL,
    "deliveryOrderId" TEXT NOT NULL,
    "status" "SPBStatus" NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalDocument" (
    "id" TEXT NOT NULL,
    "approvalId" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ApprovalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterUnit" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterSatuan" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterSatuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterKategoriBarangJadi" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterKategoriBarangJadi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AU58" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AU58_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SPB" (
    "id" TEXT NOT NULL,
    "noSpb" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "franco" TEXT NOT NULL,
    "fileUrl" TEXT,
    "customerName" TEXT NOT NULL,
    "subtotalAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unitId" TEXT NOT NULL,
    "isComplete" "IsCompleteSPB" NOT NULL,
    "isCekPajak" BOOLEAN NOT NULL DEFAULT false,
    "tanggalPengiriman" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "selectionStatus" "SelectionStatus" NOT NULL DEFAULT 'NOT_SELECTED',
    "typeSalesSPb" "TypePenjualan" DEFAULT 'null',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SPBStatus" NOT NULL DEFAULT 'CREATED',
    "staffId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SPB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itemsSPB" (
    "id" TEXT NOT NULL,
    "spbId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER,
    "unitPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "stockProduct" INTEGER NOT NULL,
    "priceProduct" DOUBLE PRECISION NOT NULL,
    "kodeBarangProduct" TEXT NOT NULL,
    "namabarangProduct" TEXT NOT NULL,
    "namabarangProductInvoice" TEXT NOT NULL,
    "spesifikasiProduct" TEXT NOT NULL,
    "beratproduct" INTEGER NOT NULL,
    "kategoriProduct" TEXT NOT NULL,
    "satuanProduct" TEXT NOT NULL,
    "unitProduct" TEXT NOT NULL,
    "isCekPajak" BOOLEAN NOT NULL DEFAULT false,
    "typeSalesSPb" "TypePenjualan" DEFAULT 'null',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itemsSPB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countCekPajak" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countCekPajak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SPBTax" (
    "id" TEXT NOT NULL,
    "spbId" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "taxValue" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "accountCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SPBTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "spbId" TEXT NOT NULL,
    "contractId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "amountWithTax" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "selectionStatus" "SelectionStatus" NOT NULL DEFAULT 'NOT_SELECTED',
    "typeInvoice" "TypePenjualan" DEFAULT 'null',
    "paymentDate" TIMESTAMP(3),
    "status" "StatusInvoice" NOT NULL DEFAULT 'HUTANG',
    "userId" TEXT,
    "masterUnitId" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAsset" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acquisitionDate" TIMESTAMP(3) NOT NULL,
    "acquisitionValue" DOUBLE PRECISION NOT NULL,
    "usefulLife" INTEGER NOT NULL,
    "depreciationMethod" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FixedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "transactionType" "InventoryType" NOT NULL,
    "source" TEXT,
    "sourceId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitId" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "nilaiSatuan" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransactionBarangMentah" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "transactionType" "InventoryType" NOT NULL,
    "source" TEXT,
    "sourceId" TEXT,
    "quantity" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL,
    "nilaiSatuan" DOUBLE PRECISION NOT NULL,
    "unitId" TEXT NOT NULL,
    "averageCostAfter" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "stockAfter" INTEGER,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InventoryTransactionBarangMentah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockSummaryBarangMentah" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "averageCost" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StockSummaryBarangMentah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpeningBalanceHeader" (
    "id" TEXT NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "postedAt" TIMESTAMP(3),
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "totalBalance" DECIMAL(65,30) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "OpeningBalanceHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpeningBalance" (
    "id" TEXT NOT NULL,
    "headerId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fiscalYear" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "OpeningBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMaterialOpeningItem" (
    "id" TEXT NOT NULL,
    "openingId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "nilaiSatuan" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "satuan" TEXT NOT NULL,
    "stok" INTEGER NOT NULL,
    "Total" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RawMaterialOpeningItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterAcitva" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterAcitva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterRawMaterial" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterRawMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterRekananBahanBaku" (
    "id" TEXT NOT NULL,
    "nomorPengenal" TEXT NOT NULL,
    "namaRekanan" TEXT NOT NULL,
    "alamatRekanan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "accountCode" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "MasterRekananBahanBaku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMaterialReceipt" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "noRekening" TEXT NOT NULL,
    "pengadaanBarang" "PengadaanBarang" NOT NULL,
    "faktur" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isLunas" TEXT NOT NULL DEFAULT 'N',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RawMaterialReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMaterialReceiptItem" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "masterRawMaterialId" TEXT NOT NULL,
    "nilaiSatuan" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "satuan" TEXT NOT NULL,
    "stok" INTEGER NOT NULL,
    "Total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RawMaterialReceiptItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMaterialIssue" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "diPergunakan" "DiPergunakan" NOT NULL,
    "keterangan" TEXT NOT NULL,
    "noBppTerakhir" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RawMaterialIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMaterialIssuetItem" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "masterRawMaterialId" TEXT NOT NULL,
    "nilaiSatuan" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "satuan" TEXT NOT NULL,
    "Total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RawMaterialIssuetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterBarangJadi" (
    "id" TEXT NOT NULL,
    "kodeBarang" TEXT NOT NULL,
    "namaBarang" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "nilaiSatuan" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "staffId" TEXT NOT NULL,

    CONSTRAINT "MasterBarangJadi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionReceipt" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductionReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionReceiptItem" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "finishedGoodId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "Satuan" TEXT NOT NULL,
    "nilaiSatuan" DOUBLE PRECISION NOT NULL,
    "stok" INTEGER NOT NULL,
    "spesifikasi" TEXT NOT NULL,
    "namaBarang" TEXT,
    "kodeBarang" TEXT,
    "kategori" TEXT,
    "Total" DOUBLE PRECISION NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "productionIssueId" TEXT,

    CONSTRAINT "ProductionReceiptItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionIssue" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductionIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionIssueItem" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "finishedGoodId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "Satuan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductionIssueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionCost" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "unitCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductionCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionCostItem" (
    "id" TEXT NOT NULL,
    "costId" TEXT NOT NULL,
    "finishedGoodId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductionCostItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockAverage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "averageCost" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockAverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountMapping" (
    "id" TEXT NOT NULL,
    "module" "Module" NOT NULL,
    "transactionType" "TransactionTypeMapping" NOT NULL,
    "position" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceEkspor" (
    "id" TEXT NOT NULL,
    "spbId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "proformaNumber" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "purchaseOrder" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "incoterms" "Incoterms" NOT NULL DEFAULT 'null',
    "status" "StatusInvoice" NOT NULL DEFAULT 'HUTANG',
    "staffId" TEXT NOT NULL,
    "totalCIF" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "typePayment" "TypePayment" NOT NULL DEFAULT 'FULLPAYMENT_AFTER_INVOICE',
    "downPayment" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paymentDate" TIMESTAMP(3),
    "masterUnitId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "fileUrl" TEXT,

    CONSTRAINT "InvoiceEkspor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostSummary" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_key" ON "Menu"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_path_key" ON "Menu"("path");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceTax_invoiceId_taxId_key" ON "InvoiceTax"("invoiceId", "taxId");

-- CreateIndex
CREATE UNIQUE INDEX "Tax_accountCode_key" ON "Tax"("accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "TaxTypeMap_code_key" ON "TaxTypeMap"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_purchaseOrderId_key" ON "Contract"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_deliveryOrderId_key" ON "Contract"("deliveryOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Finance_purchaseOrderId_key" ON "Finance"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountCode_key" ON "BankAccount"("accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "AccountType_name_key" ON "AccountType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AccountType_code_key" ON "AccountType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Account_code_key" ON "Account"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralLedger_unitId_accountCode_period_key" ON "GeneralLedger"("unitId", "accountCode", "period");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_year_month_accountCode_unitId_key" ON "Budget"("year", "month", "accountCode", "unitId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_orderNumber_key" ON "PurchaseOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrderTax_purchaseOrderId_taxId_key" ON "PurchaseOrderTax"("purchaseOrderId", "taxId");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_numberJurnal_key" ON "JournalEntry"("numberJurnal");

-- CreateIndex
CREATE INDEX "JournalEntry_transactionId_idx" ON "JournalEntry"("transactionId");

-- CreateIndex
CREATE INDEX "JournalEntry_spbId_idx" ON "JournalEntry"("spbId");

-- CreateIndex
CREATE UNIQUE INDEX "Receivable_purchaseOrderId_key" ON "Receivable"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "CashBankTransaction_transactionNumber_key" ON "CashBankTransaction"("transactionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CashBankTransaction_invoiceId_key" ON "CashBankTransaction"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "CashBankTransaction_invoiceEksporId_key" ON "CashBankTransaction"("invoiceEksporId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryOrder_purchaseOrderId_key" ON "DeliveryOrder"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "StockRequest_deliveryOrderId_key" ON "StockRequest"("deliveryOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalDocument_approvalId_key" ON "ApprovalDocument"("approvalId");

-- CreateIndex
CREATE UNIQUE INDEX "MasterUnit_kode_key" ON "MasterUnit"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "MasterUnit_nama_key" ON "MasterUnit"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "MasterSatuan_kode_key" ON "MasterSatuan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "MasterKategoriBarangJadi_kode_key" ON "MasterKategoriBarangJadi"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "SPB_noSpb_key" ON "SPB"("noSpb");

-- CreateIndex
CREATE UNIQUE INDEX "countCekPajak_purchaseOrderId_key" ON "countCekPajak"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "SPBTax_spbId_taxId_key" ON "SPBTax"("spbId", "taxId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_spbId_key" ON "Invoice"("spbId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_contractId_key" ON "Invoice"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "FixedAsset_code_key" ON "FixedAsset"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StockSummaryBarangMentah_productId_key" ON "StockSummaryBarangMentah"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "OpeningBalance_accountCode_headerId_key" ON "OpeningBalance"("accountCode", "headerId");

-- CreateIndex
CREATE UNIQUE INDEX "MasterAcitva_itemCode_key" ON "MasterAcitva"("itemCode");

-- CreateIndex
CREATE UNIQUE INDEX "MasterRekananBahanBaku_nomorPengenal_key" ON "MasterRekananBahanBaku"("nomorPengenal");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterialReceipt_documentCode_key" ON "RawMaterialReceipt"("documentCode");

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterialIssue_documentCode_key" ON "RawMaterialIssue"("documentCode");

-- CreateIndex
CREATE UNIQUE INDEX "MasterBarangJadi_kodeBarang_key" ON "MasterBarangJadi"("kodeBarang");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionReceipt_documentCode_key" ON "ProductionReceipt"("documentCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionIssue_documentCode_key" ON "ProductionIssue"("documentCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCost_documentCode_key" ON "ProductionCost"("documentCode");

-- CreateIndex
CREATE UNIQUE INDEX "StockAverage_productId_key" ON "StockAverage"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountMapping_module_transactionType_position_usage_key" ON "AccountMapping"("module", "transactionType", "position", "usage");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceEkspor_spbId_key" ON "InvoiceEkspor"("spbId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceEkspor_invoiceNumber_key" ON "InvoiceEkspor"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceTax" ADD CONSTRAINT "InvoiceTax_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceTax" ADD CONSTRAINT "InvoiceTax_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_deliveryOrderId_fkey" FOREIGN KEY ("deliveryOrderId") REFERENCES "DeliveryOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_signedById_fkey" FOREIGN KEY ("signedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_accountTypeId_fkey" FOREIGN KEY ("accountTypeId") REFERENCES "AccountType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Account"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalCharges" ADD CONSTRAINT "AdditionalCharges_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MasterBarangJadi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderTax" ADD CONSTRAINT "PurchaseOrderTax_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderTax" ADD CONSTRAINT "PurchaseOrderTax_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderTax" ADD CONSTRAINT "PurchaseOrderTax_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_spbId_fkey" FOREIGN KEY ("spbId") REFERENCES "SPB"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_rawMaterialIssueId_fkey" FOREIGN KEY ("rawMaterialIssueId") REFERENCES "RawMaterialIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_rawMaterialReceiptId_fkey" FOREIGN KEY ("rawMaterialReceiptId") REFERENCES "RawMaterialReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "CashBankTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_intercompanyReference_fkey" FOREIGN KEY ("intercompanyReference") REFERENCES "JournalEntry"("numberJurnal") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_purchaseOrderTaxId_fkey" FOREIGN KEY ("purchaseOrderTaxId") REFERENCES "PurchaseOrderTax"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_sPBTaxId_fkey" FOREIGN KEY ("sPBTaxId") REFERENCES "SPBTax"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryDetail" ADD CONSTRAINT "JournalEntryDetail_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryDetail" ADD CONSTRAINT "JournalEntryDetail_fixedAssetId_fkey" FOREIGN KEY ("fixedAssetId") REFERENCES "FixedAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryDetail" ADD CONSTRAINT "JournalEntryDetail_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryDetail" ADD CONSTRAINT "JournalEntryDetail_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receivable" ADD CONSTRAINT "Receivable_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransaction" ADD CONSTRAINT "CashBankTransaction_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransaction" ADD CONSTRAINT "CashBankTransaction_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransaction" ADD CONSTRAINT "CashBankTransaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransaction" ADD CONSTRAINT "CashBankTransaction_invoiceEksporId_fkey" FOREIGN KEY ("invoiceEksporId") REFERENCES "InvoiceEkspor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransaction" ADD CONSTRAINT "CashBankTransaction_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashBankTransaction" ADD CONSTRAINT "CashBankTransaction_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithholdingTax" ADD CONSTRAINT "WithholdingTax_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "CashBankTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesPlan" ADD CONSTRAINT "SalesPlan_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesPlan" ADD CONSTRAINT "SalesPlan_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxReport" ADD CONSTRAINT "TaxReport_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryOrder" ADD CONSTRAINT "DeliveryOrder_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryOrder" ADD CONSTRAINT "DeliveryOrder_au58Id_fkey" FOREIGN KEY ("au58Id") REFERENCES "AU58"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryOrder" ADD CONSTRAINT "DeliveryOrder_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryOrder" ADD CONSTRAINT "DeliveryOrder_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockRequest" ADD CONSTRAINT "StockRequest_deliveryOrderId_fkey" FOREIGN KEY ("deliveryOrderId") REFERENCES "DeliveryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockRequest" ADD CONSTRAINT "StockRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalDocument" ADD CONSTRAINT "ApprovalDocument_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "ApprovalRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterSatuan" ADD CONSTRAINT "MasterSatuan_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterKategoriBarangJadi" ADD CONSTRAINT "MasterKategoriBarangJadi_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AU58" ADD CONSTRAINT "AU58_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPB" ADD CONSTRAINT "SPB_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPB" ADD CONSTRAINT "SPB_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPB" ADD CONSTRAINT "SPB_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemsSPB" ADD CONSTRAINT "itemsSPB_spbId_fkey" FOREIGN KEY ("spbId") REFERENCES "SPB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemsSPB" ADD CONSTRAINT "itemsSPB_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MasterBarangJadi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPBTax" ADD CONSTRAINT "SPBTax_spbId_fkey" FOREIGN KEY ("spbId") REFERENCES "SPB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPBTax" ADD CONSTRAINT "SPBTax_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SPBTax" ADD CONSTRAINT "SPBTax_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_spbId_fkey" FOREIGN KEY ("spbId") REFERENCES "SPB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_masterUnitId_fkey" FOREIGN KEY ("masterUnitId") REFERENCES "MasterUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MasterBarangJadi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransactionBarangMentah" ADD CONSTRAINT "InventoryTransactionBarangMentah_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransactionBarangMentah" ADD CONSTRAINT "InventoryTransactionBarangMentah_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MasterRawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockSummaryBarangMentah" ADD CONSTRAINT "StockSummaryBarangMentah_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MasterRawMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBalanceHeader" ADD CONSTRAINT "OpeningBalanceHeader_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBalanceHeader" ADD CONSTRAINT "OpeningBalanceHeader_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBalance" ADD CONSTRAINT "OpeningBalance_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "OpeningBalanceHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBalance" ADD CONSTRAINT "OpeningBalance_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBalance" ADD CONSTRAINT "OpeningBalance_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpeningBalance" ADD CONSTRAINT "OpeningBalance_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialOpeningItem" ADD CONSTRAINT "RawMaterialOpeningItem_openingId_fkey" FOREIGN KEY ("openingId") REFERENCES "OpeningBalanceHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterAcitva" ADD CONSTRAINT "MasterAcitva_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterAcitva" ADD CONSTRAINT "MasterAcitva_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterRawMaterial" ADD CONSTRAINT "MasterRawMaterial_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterRawMaterial" ADD CONSTRAINT "MasterRawMaterial_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterRekananBahanBaku" ADD CONSTRAINT "MasterRekananBahanBaku_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialReceipt" ADD CONSTRAINT "RawMaterialReceipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "MasterRekananBahanBaku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialReceipt" ADD CONSTRAINT "RawMaterialReceipt_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialReceiptItem" ADD CONSTRAINT "RawMaterialReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "RawMaterialReceipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialReceiptItem" ADD CONSTRAINT "RawMaterialReceiptItem_masterRawMaterialId_fkey" FOREIGN KEY ("masterRawMaterialId") REFERENCES "MasterRawMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialIssuetItem" ADD CONSTRAINT "RawMaterialIssuetItem_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "RawMaterialIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialIssuetItem" ADD CONSTRAINT "RawMaterialIssuetItem_masterRawMaterialId_fkey" FOREIGN KEY ("masterRawMaterialId") REFERENCES "MasterRawMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterBarangJadi" ADD CONSTRAINT "MasterBarangJadi_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReceipt" ADD CONSTRAINT "ProductionReceipt_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReceipt" ADD CONSTRAINT "ProductionReceipt_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReceiptItem" ADD CONSTRAINT "ProductionReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "ProductionReceipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReceiptItem" ADD CONSTRAINT "ProductionReceiptItem_finishedGoodId_fkey" FOREIGN KEY ("finishedGoodId") REFERENCES "MasterBarangJadi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReceiptItem" ADD CONSTRAINT "ProductionReceiptItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionReceiptItem" ADD CONSTRAINT "ProductionReceiptItem_productionIssueId_fkey" FOREIGN KEY ("productionIssueId") REFERENCES "ProductionIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionIssue" ADD CONSTRAINT "ProductionIssue_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MasterUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionIssueItem" ADD CONSTRAINT "ProductionIssueItem_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "ProductionIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionIssueItem" ADD CONSTRAINT "ProductionIssueItem_finishedGoodId_fkey" FOREIGN KEY ("finishedGoodId") REFERENCES "MasterBarangJadi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionCostItem" ADD CONSTRAINT "ProductionCostItem_costId_fkey" FOREIGN KEY ("costId") REFERENCES "ProductionCost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionCostItem" ADD CONSTRAINT "ProductionCostItem_finishedGoodId_fkey" FOREIGN KEY ("finishedGoodId") REFERENCES "MasterBarangJadi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAverage" ADD CONSTRAINT "StockAverage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MasterBarangJadi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountMapping" ADD CONSTRAINT "AccountMapping_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "Account"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceEkspor" ADD CONSTRAINT "InvoiceEkspor_spbId_fkey" FOREIGN KEY ("spbId") REFERENCES "SPB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceEkspor" ADD CONSTRAINT "InvoiceEkspor_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceEkspor" ADD CONSTRAINT "InvoiceEkspor_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceEkspor" ADD CONSTRAINT "InvoiceEkspor_masterUnitId_fkey" FOREIGN KEY ("masterUnitId") REFERENCES "MasterUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostSummary" ADD CONSTRAINT "CostSummary_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "InvoiceEkspor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
