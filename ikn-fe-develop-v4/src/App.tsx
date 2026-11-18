import { Suspense, lazy } from 'react';
import './App.css';
import { Routes, Route } from 'react-router';
const DashboardPage = lazy(() => import('./modules/dashboard/pages'));
const ManagementDashboardPage = lazy(() => import('./pages/management-dashboard/pages'));
const AuthenticationPage = lazy(() => import('./modules/authentication/pages'));
const UnitPage = lazy(() => import('./pages/master/unit/pages'));
const MainLayout = lazy(() => import('./layout/MainLayout'));
const UnitAdd = lazy(() => import('./pages/master/unit/structure/Add/UnitAdd'));
const KategoriPage = lazy(() => import('./pages/master/kategori/pages'));
const KategoriAdd = lazy(() => import('./pages/master/kategori/structure/Add/KategoriAdd'));
const UnitUpdate = lazy(() => import('./pages/master/unit/structure/Update/UnitUpdate'));
const KategoriUpdate = lazy(
  () => import('./pages/master/kategori/structure/Update/KategoriUpdate')
);
const SatuanPage = lazy(() => import('./pages/master/satuan/pages'));
const SatuanAdd = lazy(() => import('./pages/master/satuan/structure/Add/SatuanAdd'));

const SatuanUpdate = lazy(() => import('./pages/master/satuan/structure/Update/SatuanUpdate'));
const BarangjadiPage = lazy(() => import('./pages/master/barang-jadi/pages'));
const BarangJadiAdd = lazy(() => import('./pages/master/barang-jadi/structure/Add/BarangjadiAdd'));
const BarangJadiUpdate = lazy(
  () => import('./pages/master/barang-jadi/structure/Update/BarangUpdate')
);
const UserManagementPage = lazy(() => import('./pages/user-management/pages'));
const UserManagementAdd = lazy(
  () => import('./pages/user-management/structure/Add/UserManagementAdd')
);
const UserManagementUpdate = lazy(
  () => import('./pages/user-management/structure/Update/UserManagementUpdate')
);
const CustomersPage = lazy(() => import('./pages/master/customer/pages'));
const CustomersAdd = lazy(() => import('./pages/master/customer/structure/Add/CustomersAdd'));
const CustomerUpdate = lazy(
  () => import('./pages/master/customer/structure/Update/CustomersUpdate')
);
const SalesPlanPage = lazy(() => import('./pages/marketing/sales-plan/pages'));
const SalesPlanAdd = lazy(() => import('./pages/marketing/sales-plan/structure/Add/SalesPlanAdd'));
const SalesPlanUpdate = lazy(
  () => import('./pages/marketing/sales-plan/structure/Update/SalesPlanUpdate')
);
const OrderPraPage = lazy(() => import('./pages/marketing/order-pra/pages'));
const OrderPraAdd = lazy(() => import('./pages/marketing/order-pra/structure/Add/OrderPraAdd'));
const OrderPraUpdate = lazy(
  () => import('./pages/marketing/order-pra/structure/Update/OrderPraUpdate')
);
const OrderDetail = lazy(() => import('./pages/marketing/order-pra/structure/Detail/OrderDetail'));
const DeliveryOrderPraPage = lazy(() => import('./pages/marketing/delivery-order-pra/pages'));
const DeliveryOrderPraAdd = lazy(
  () => import('./pages/marketing/delivery-order-pra/structure/Add/DeliveryOrderPraAdd')
);
const DeliveryOrderPraUpdate = lazy(
  () => import('./pages/marketing/delivery-order-pra/structure/Update/DeliveryOrderPraUpdate')
);
const DeliveryOrderDetail = lazy(
  () => import('./pages/marketing/delivery-order-pra/structure/Detail/DeliveryOrderDetail')
);

const SpbsPage = lazy(() => import('./pages/akuntansi/spbs/pages'));
const SpbsAdd = lazy(() => import('./pages/akuntansi/spbs/structure/Add/SpbsAdd'));
const SpbsDetail = lazy(() => import('./pages/akuntansi/spbs/structure/Detail/SpbsDetail'));
const CrossChekPajakPage = lazy(() => import('./pages/keuangan/cross-chek-pajak/pages'));
const CrossChekPajakAdd = lazy(
  () => import('./pages/keuangan/cross-chek-pajak/structure/Add/CrossChekPajakAdd')
);
const InvoicePage = lazy(() => import('./pages/marketing/invoice/pages'));
const InvoiceAdd = lazy(() => import('./pages/marketing/invoice/structure/Add/InvoiceAdd'));
const InvoiceUpdate = lazy(
  () => import('./pages/marketing/invoice/structure/Update/InvoicePraUpdate')
);
const InvoiceDetail = lazy(
  () => import('./pages/marketing/invoice/structure/Detail/InvoiceDetail')
);
const TransactionPage = lazy(() => import('./pages/keuangan/transaction/pages'));
const TransactionAdd = lazy(
  () => import('./pages/keuangan/transaction/structure/Add/transactionAdd')
);
const TransactionDetail = lazy(
  () => import('./pages/keuangan/transaction/structure/Detail/TransactionDetail')
);
const JurnalKhususPage = lazy(() => import('./pages/keuangan/jurnal/jurnal-khusus/pages'));
const RawMaterial = lazy(() => import('./pages/master/barang-mentah/pages'));
const RawMaterialAdd = lazy(
  () => import('./pages/master/barang-mentah/structure/Add/RawMaterialAdd')
);
const RawMaterialUpdate = lazy(
  () => import('./pages/master/barang-mentah/structure/Update/RawMaterialUpdate')
);
const BarangJadiPageTransaaction = lazy(() => import('./pages/gudang/barang-jadi/pages'));
const BarangJadiPageTransaactionAdd = lazy(
  () => import('./pages/gudang/barang-jadi/structure/Add/BarangJadiAdd')
);
const BarangJadiPageTransaactionEdit = lazy(
  () => import('./pages/gudang/barang-jadi/structure/Update/BarangJadiUpdate')
);
const BarangJadiPageTransaactionDetail = lazy(
  () => import('./pages/gudang/barang-jadi/structure/Detail/BarangJadiDetail')
);

const BarangJadiIssuePage = lazy(() => import('./pages/gudang/barang-jadi-issue/pages'));
const BarangJadiIssueAdd = lazy(
  () => import('./pages/gudang/barang-jadi-issue/structure/Add/BarangJadiIssueAdd')
);
const BarangJadiIssueUpdate = lazy(
  () => import('./pages/gudang/barang-jadi-issue/structure/Update/BarangJadiIssueUpdate')
);
const BarangJadiIssueDetail = lazy(
  () => import('./pages/gudang/barang-jadi-issue/structure/Detail/BarangJadiIssueDetail')
);

const BarangMentahPage = lazy(() => import('./pages/gudang/barang-mentah/pages'));
const BarangMentahAdd = lazy(
  () => import('./pages/gudang/barang-mentah/structure/Add/BarangMentahAdd')
);
const BarangMentahUpdate = lazy(
  () => import('./pages/gudang/barang-mentah/structure/Update/BarangMentahUpdate')
);
const BarangMentahDetail = lazy(
  () => import('./pages/gudang/barang-mentah/structure/Detail/BarangMentahDetail')
);
const BarangMentahIssuePage = lazy(() => import('./pages/gudang/barang-mentah-issue/pages'));
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import PublicRoute from './components/auth/PublicRoute';
const BarangMentahIssueAdd = lazy(
  () => import('./pages/gudang/barang-mentah-issue/structure/Add/BarangMentahIssueAdd')
);
const BarangMentahIssueUpdate = lazy(
  () => import('./pages/gudang/barang-mentah-issue/structure/Update/BarangMentahIssueUpdate')
);
const BarangMentahIssueDetail = lazy(
  () => import('./pages/gudang/barang-mentah-issue/structure/Detail/BarangMentahIssueDetail')
);

const SupplierPage = lazy(() => import('./pages/master/supplier/pages'));
const SupplierAdd = lazy(() => import('./pages/master/supplier/structure/Add/SupplierAdd'));
const SupplierUpdate = lazy(
  () => import('./pages/master/supplier/structure/Update/SupplierUpdate')
);

const AkunBankPage = lazy(() => import('./pages/master/master-akun-bank/pages'));
const AkunBankAdd = lazy(() => import('./pages/master/master-akun-bank/structure/Add/AkunBankAdd'));
const AkunBankUpdate = lazy(
  () => import('./pages/master/master-akun-bank/structure/Update/AkunBankUpdate')
);
const AkunBankDetail = lazy(
  () => import('./pages/master/master-akun-bank/structure/Detail/AkunBankDetail')
);

const DeliveryOrderRequestPraPage = lazy(
  () => import('./pages/akuntansi/delivery-order-request-pra/pages')
);
const DeliveryOrderRequestDetail = lazy(
  () =>
    import('./pages/akuntansi/delivery-order-request-pra/structure/Detail/DeliveryOrderRequestDetail')
);

const SalesReportPage = lazy(() => import('./pages/marketing/sales-report/pages'));

const AccountAdd = lazy(
  () => import('./pages/master/account-index/account/structure/Add/AccountAdd')
);
const AccountUpdate = lazy(
  () => import('./pages/master/account-index/account/structure/Update/AccountUpdate')
);

const TransactionOutPage = lazy(() => import('./pages/keuangan/transactionOut/pages'));
const TransactionOutAdd = lazy(
  () => import('./pages/keuangan/transactionOut/structure/Add/transactionAddOut')
);
const TransactionOutUpdate = lazy(
  () => import('./pages/keuangan/transactionOut/structure/Update/transactionOutUpdate')
);
const TransactionOutDetail = lazy(
  () => import('./pages/keuangan/transactionOut/structure/Detail/TransactionOutDetail')
);

const SaldoKeuangan = lazy(() => import('./pages/keuangan/saldo-keuangan/pages'));

const DeliveryOrderRNPage = lazy(() => import('./pages/marketing-rn/delivery-order-rn/pages'));
const DeliveryOrderRNAdd = lazy(
  () => import('./pages/marketing-rn/delivery-order-rn/structure/Add/DeliveryOrderRNAdd')
);
const DeliveryOrderRNUpdate = lazy(
  () => import('./pages/marketing-rn/delivery-order-rn/structure/Update/DeliveryOrderRNUpdate')
);
const DeliveryOrderDetailRN = lazy(
  () => import('./pages/marketing-rn/delivery-order-rn/structure/Detail/DeliveryOrderDetailRN')
);

const OrderRNPage = lazy(() => import('./pages/marketing-rn/order-rn/pages'));
const OrderRNAdd = lazy(() => import('./pages/marketing-rn/order-rn/structure/Add/OrderRNAdd'));
const OrderRNUpdate = lazy(
  () => import('./pages/marketing-rn/order-rn/structure/Update/OrderRNUpdate')
);
const OrderPRNDetail = lazy(
  () => import('./pages/marketing-rn/order-rn/structure/Detail/OrderDetail')
);

const InvoicePageRN = lazy(() => import('./pages/marketing-rn/invoice-rn/pages'));
const InvoiceAddRN = lazy(
  () => import('./pages/marketing-rn/invoice-rn/structure/Add/InvoiceAddRN')
);
const InvoiceUpdateRN = lazy(
  () => import('./pages/marketing-rn/invoice-rn/structure/Update/InvoicePraUpdateRN')
);
const InvoiceDetailRN = lazy(
  () => import('./pages/marketing-rn/invoice-rn/structure/Detail/InvoiceDetailRN')
);

const SalesPlanRNPage = lazy(() => import('./pages/marketing-rn/sales-plan-rn/pages'));
const SalesPlanRNAdd = lazy(
  () => import('./pages/marketing-rn/sales-plan-rn/structure/Add/SalesPlanRNAdd')
);
const SalesPlanRNUpdate = lazy(
  () => import('./pages/marketing-rn/sales-plan-rn/structure/Update/SalesPlanRNUpdate')
);

const SalesReportRNPage = lazy(() => import('./pages/marketing-rn/sales-report-rn/pages'));

const CrossChekPajakRNAdd = lazy(
  () => import('./pages/keuangan/cross-chek-pajak/structure/Add/CrossChekPajakRNAdd')
);

const AccounMappingtAdd = lazy(
  () => import('./pages/master/account-index/account-mapping/structure/Add/AccountMappingAdd')
);
const AccountMappingUpdate = lazy(
  () => import('./pages/master/account-index/account-mapping/structure/Update/AccountMappingUpdate')
);

const AccountIndex = lazy(() => import('./pages/master/account-index/page'));

const JurnalKhususDetail = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-khusus/structure/Detail/JurnalKhususDetail')
);
const JurnalKhususEdit = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-khusus/structure/Update/JurnalKhususEdit')
);

const JurnalUmumPage = lazy(() => import('./pages/keuangan/jurnal/jurnal-umum/pages'));
const JurnalUmumAdd = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-umum/structture/Add/JurnalUmumAdd')
);
const JurnalUmumEdit = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-umum/structture/Edit/JurnalUmumEdit')
);
const JurnalKUmumDetail = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-umum/structture/Detail/JurnalKUmumDetail')
);

const MenuAdd = lazy(() => import('./pages/user-management/structure/Add/MenuAdd'));
const RoleAdd = lazy(() => import('./pages/user-management/structure/Add/RoleAdd'));

const OpeningBalancePage = lazy(() => import('./pages/akuntansi/opening-balance/pages'));
const OpeningBalanceAdd = lazy(
  () => import('./pages/akuntansi/opening-balance/structture/Add/OpeninBalanceAdd')
);
const OpeningBalanceDetail = lazy(
  () => import('./pages/akuntansi/opening-balance/structture/Detail/OpeningBalanceDetail')
);

const AccountTypeAdd = lazy(
  () => import('./pages/master/account-index/account-type/structure/Add/AccountTypeAdd')
);

const GeneralEdger = lazy(() => import('./pages/akuntansi/general-ledger/pages'));

const SalesPlanEksporRNAdd = lazy(
  () =>
    import('./pages/marketing-rn-ekspor/sales-plan-rn-ekspor/structure/Add/SalesPlanEksporRNAdd')
);
const SalesPlanEksporRNUpdate = lazy(
  () =>
    import('./pages/marketing-rn-ekspor/sales-plan-rn-ekspor/structure/Update/SalesPlanEksporRNUpdate')
);
const SalesPlanEksporRNPage = lazy(
  () => import('./pages/marketing-rn-ekspor/sales-plan-rn-ekspor/pages')
);

const OrderEksporRNUpdate = lazy(
  () => import('./pages/marketing-rn-ekspor/order-rn-ekspor/structure/Update/OrderEksporRNUpdate')
);
const OrderEksporRNPage = lazy(() => import('./pages/marketing-rn-ekspor/order-rn-ekspor/pages'));
const OrderEksporRNAdd = lazy(
  () => import('./pages/marketing-rn-ekspor/order-rn-ekspor/structure/Add/OrderEksporRNAdd')
);
const OrderEksporPRNDetail = lazy(
  () => import('./pages/marketing-rn-ekspor/order-rn-ekspor/structure/Detail/OrderEksporDetail')
);

const DeliveryOrderDetailEksporRN = lazy(
  () =>
    import('./pages/marketing-rn-ekspor/delivery-order-rn-ekspor/structure/Detail/DeliveryOrderDetailEksporRN')
);
const DeliveryOrderEkpsorRNPage = lazy(
  () => import('./pages/marketing-rn-ekspor/delivery-order-rn-ekspor/pages')
);
const DeliveryOrderEksporRNAdd = lazy(
  () =>
    import('./pages/marketing-rn-ekspor/delivery-order-rn-ekspor/structure/Add/DeliveryOrderEksporRNAdd')
);
const DeliveryOrderEkpsorRNUpdate = lazy(
  () =>
    import('./pages/marketing-rn-ekspor/delivery-order-rn-ekspor/structure/Update/DeliveryOrderEksporRNUpdate')
);

const InvoicePageEksporRN = lazy(
  () => import('./pages/marketing-rn-ekspor/invoice-rn-ekspor/pages')
);
const InvoiceUpdateEksporRN = lazy(
  () =>
    import('./pages/marketing-rn-ekspor/invoice-rn-ekspor/structure/Update/InvoiceUpdateEksporRN')
);
const InvoiceDetailEkpsorRN = lazy(
  () =>
    import('./pages/marketing-rn-ekspor/invoice-rn-ekspor/structure/Detail/InvoiceDetailEksporRN')
);

const SalesReportEksporRNPage = lazy(
  () => import('./pages/marketing-rn-ekspor/sales-report-rn-ekspor/pages')
);

const TransactionDollarAdd = lazy(
  () => import('./pages/keuangan/transaction-dollar/structure/Add/transactionDollarAdd')
);
const TransactionDollarPage = lazy(() => import('./pages/keuangan/transaction-dollar/pages'));

const TransactionDollarUpdate = lazy(
  () => import('./pages/keuangan/transaction-dollar/structure/Update/transactionDollarUpdate')
);
const InvoiceAddEksporRN = lazy(
  () => import('./pages/marketing-rn-ekspor/invoice-rn-ekspor/structure/Add/InvoiceAddEksporRN')
);

const JurnalKhususDollarEdit = lazy(
  () =>
    import('./pages/keuangan/jurnal/jurnal-khusus-dollar/structure/Update/JurnalKhususDollarEdit')
);
const JurnalKhususDollarDetail = lazy(
  () =>
    import('./pages/keuangan/jurnal/jurnal-khusus-dollar/structure/Detail/JurnalKhususDollarDetail')
);
const JurnalKhususDollarPage = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-khusus-dollar/pages')
);

const FinanceReportPage = lazy(() => import('./pages/keuangan/finance-report/pages'));

const MenuUpdate = lazy(() => import('./pages/user-management/structure/Update/MenuUpdate'));
const RoleUpdate = lazy(() => import('./pages/user-management/structure/Update/RoleUpdate'));

const NotFound = lazy(() => import('./components/pages/NotFound'));

const OpeningBalanceEdit = lazy(
  () => import('./pages/akuntansi/opening-balance/structture/Edit/OpeningBalanceEdit')
);

const TransactionUpdate = lazy(
  () => import('./pages/keuangan/transaction/structure/Update/transactionUpdate')
);

const AccountTypeUpdate = lazy(
  () => import('./pages/master/account-index/account-type/structure/Update/AccountUpdate')
);

const InvoiceFinance = lazy(() => import('./pages/keuangan/Invoice/pages'));

const TransactionDollarDetail = lazy(
  () => import('./pages/keuangan/transaction-dollar/structure/Detail/TransactionDollarDetail')
);

const CrossChekPajakDetail = lazy(
  () => import('./pages/keuangan/cross-chek-pajak/structure/Detail/CrossChekPajakDetail')
);
const CrossChekPajakRNDetail = lazy(
  () => import('./pages/keuangan/cross-chek-pajak/structure/Detail/CrossChekPajakRNDetail')
);

const TransactionOutRawMaterialPage = lazy(
  () => import('./pages/keuangan/transactionOutRawMaterial/pages')
);
const TransactionOutUpdateRawMaterial = lazy(
  () =>
    import('./pages/keuangan/transactionOutRawMaterial/structure/Update/transactionOutUpdateRawMaterial')
);
const TransactionOutAddRawMaterial = lazy(
  () =>
    import('./pages/keuangan/transactionOutRawMaterial/structure/Add/transactionAddOutRawMaterial')
);
const TransactionOutDetailRawMaterial = lazy(
  () =>
    import('./pages/keuangan/transactionOutRawMaterial/structure/Detail/TransactionOutDetailRawMaterial')
);

const BukuRekening = lazy(() => import('./pages/akuntansi/buku-rekening/BukuRekening'));
const BukuBesar = lazy(() => import('./pages/akuntansi/buku-besar/BukuBesar'));
const OpeningBalanceMaterial = lazy(
  () => import('./pages/akuntansi/opening-balance-material/pages')
);

const OpeningBalanceMaterialAdd = lazy(
  () =>
    import('./pages/akuntansi/opening-balance-material/structture/Add/OpeningBalanceMaterialAdd')
);

const OpeningBalanceMaterialDetail = lazy(
  () =>
    import('./pages/akuntansi/opening-balance-material/structture/Detail/OpeningBalanceMaterialDetail')
);

const OpeningBalanceMaterialEdit = lazy(
  () =>
    import('./pages/akuntansi/opening-balance-material/structture/Edit/OpeningBalanceMaterialEdit')
);
import Loading from './components/atoms/Loading/Loading';
const OpeningBalanceRevert = lazy(
  () => import('./pages/akuntansi/opening-balance/structture/Revert/OpeningBalanceRevert')
);
const JurnalKhusuDollarRevert = lazy(
  () =>
    import('./pages/keuangan/jurnal/jurnal-khusus-dollar/structure/Revert/JurnalKhusuDollarRevert')
);
const TaxUpdate = lazy(() => import('./pages/master/tax/structure/Update/TaxUpdate'));
const TaxPage = lazy(() => import('./pages/master/tax/pages'));
const TaxAdd = lazy(() => import('./pages/master/tax/structure/Add/TaxAdd'));
const JurnalUmumRevert = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-umum/structture/Revert/JurnalUmumRevert')
);
const JurnalKhususRevert = lazy(
  () => import('./pages/keuangan/jurnal/jurnal-khusus/structure/Revert/JurnalKhususRevert')
);

const CrossChekPajakUpdate = lazy(
  () => import('./pages/keuangan/cross-chek-pajak/structure/Update/CrossChekPajakUpdate')
);
const CrossChekPajakRNUpdate = lazy(
  () => import('./pages/keuangan/cross-chek-pajak/structure/Update/CrossChekPajakRNUpdate')
);
const SpbsEdit = lazy(() => import('./pages/akuntansi/spbs/structure/Update/SpbsEdit'));
const OpeningBalanceMaterialRevert = lazy(
  () =>
    import('./pages/akuntansi/opening-balance-material/structture/Revert/OpeningBalanceMaterialRevert')
);
const InvoiceDetailEkpsorRNFinance = lazy(
  () => import('./pages/keuangan/Invoice/structure/InvoiceDetail/DetailRNEks/InvoiceDetailEksporRN')
);
const InvoiceDetailRAFinance = lazy(
  () => import('./pages/keuangan/Invoice/structure/InvoiceDetail/DetailRA/InvoiceDetail')
);

const InvoiceDetailRNFinance = lazy(
  () => import('./pages/keuangan/Invoice/structure/InvoiceDetail/DetailRN/InvoiceDetailRN')
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          path="login"
          element={
            <PublicRoute>
              <AuthenticationPage />
            </PublicRoute>
          }
        />

        {/* penggunaan */}
        <Route element={<RoleBasedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard-management" element={<ManagementDashboardPage />} />
            <Route path="unit" element={<UnitPage />} />
            <Route path="unit/add" element={<UnitAdd />} />
            <Route path="unit/edit/:id" element={<UnitUpdate />} />
            <Route path="kategori" element={<KategoriPage />} />
            <Route path="kategori/add" element={<KategoriAdd />} />
            <Route path="kategori/edit/:id" element={<KategoriUpdate />} />
            <Route path="satuan" element={<SatuanPage />} />
            <Route path="satuan/add" element={<SatuanAdd />} />
            <Route path="satuan/edit/:id" element={<SatuanUpdate />} />
            <Route path="barang-jadi" element={<BarangjadiPage />} />
            <Route path="barang-jadi/add" element={<BarangJadiAdd />} />
            <Route path="barang-jadi/edit/:id" element={<BarangJadiUpdate />} />
            <Route path="user-management" element={<UserManagementPage />} />
            <Route path="user-management/add" element={<UserManagementAdd />} />
            <Route path="user-management/edit/:id" element={<UserManagementUpdate />} />
            <Route path="user-management/menu/add" element={<MenuAdd />} />
            <Route path="user-management/menu/edit/:id" element={<MenuUpdate />} />
            <Route path="user-management/roles/add" element={<RoleAdd />} />
            <Route path="user-management/roles/edit/:id" element={<RoleUpdate />} />
            <Route path="customer" element={<CustomersPage />} />
            <Route path="customer/add" element={<CustomersAdd />} />
            <Route path="customer/edit/:id" element={<CustomerUpdate />} />
            <Route path="sales-plan" element={<SalesPlanPage />} />
            <Route path="sales-plan/add" element={<SalesPlanAdd />} />
            <Route path="sales-plan/edit/:id" element={<SalesPlanUpdate />} />
            <Route path="sales-plan-rn" element={<SalesPlanRNPage />} />
            <Route path="sales-plan-rn/add" element={<SalesPlanRNAdd />} />
            <Route path="sales-plan-rn/edit/:id" element={<SalesPlanRNUpdate />} />
            <Route path="sales-plan-rn-ekspor" element={<SalesPlanEksporRNPage />} />
            <Route path="sales-plan-rn-ekspor/add" element={<SalesPlanEksporRNAdd />} />
            <Route path="sales-plan-rn-ekspor/edit/:id" element={<SalesPlanEksporRNUpdate />} />
            <Route path="po-order-pra" element={<OrderPraPage />} />
            <Route path="po-order-pra/add" element={<OrderPraAdd />} />
            <Route path="po-order-pra/edit/:id" element={<OrderPraUpdate />} />
            <Route path="po-order-pra/detail/:id" element={<OrderDetail />} />
            <Route path="po-order-prn" element={<OrderRNPage />} />
            <Route path="po-order-prn/add" element={<OrderRNAdd />} />
            <Route path="po-order-prn/edit/:id" element={<OrderRNUpdate />} />
            <Route path="po-order-prn/detail/:id" element={<OrderPRNDetail />} />
            <Route path="po-order-prn-ekspor" element={<OrderEksporRNPage />} />
            <Route path="po-order-prn-ekspor/add" element={<OrderEksporRNAdd />} />
            <Route path="po-order-prn-ekspor/edit/:id" element={<OrderEksporRNUpdate />} />
            <Route path="po-order-prn-ekspor/detail/:id" element={<OrderEksporPRNDetail />} />
            <Route path="delivery-order-pra" element={<DeliveryOrderPraPage />} />
            <Route path="delivery-order-pra/add" element={<DeliveryOrderPraAdd />} />
            <Route path="delivery-order-pra/edit/:id" element={<DeliveryOrderPraUpdate />} />
            <Route path="delivery-order-pra/detail/:id" element={<DeliveryOrderDetail />} />
            <Route path="delivery-order-prn" element={<DeliveryOrderRNPage />} />
            <Route path="delivery-order-prn/add" element={<DeliveryOrderRNAdd />} />
            <Route path="delivery-order-prn/edit/:id" element={<DeliveryOrderRNUpdate />} />
            <Route path="delivery-order-prn/detail/:id" element={<DeliveryOrderDetailRN />} />
            <Route path="delivery-order-prn-ekspor" element={<DeliveryOrderEkpsorRNPage />} />
            <Route path="delivery-order-prn-ekspor/add" element={<DeliveryOrderEksporRNAdd />} />
            <Route
              path="delivery-order-prn-ekspor/edit/:id"
              element={<DeliveryOrderEkpsorRNUpdate />}
            />
            <Route
              path="delivery-order-prn-ekspor/detail/:id"
              element={<DeliveryOrderDetailEksporRN />}
            />
            <Route path="spbs" element={<SpbsPage />} />
            <Route path="spbs/add" element={<SpbsAdd />} />
            <Route path="spbs/detail/:id" element={<SpbsDetail />} />
            <Route path="spbs/edit/:id" element={<SpbsEdit />} />
            <Route path="opening-balance" element={<OpeningBalancePage />} />
            <Route path="opening-balance/add" element={<OpeningBalanceAdd />} />
            <Route path="opening-balance/detail/:id" element={<OpeningBalanceDetail />} />
            <Route path="opening-balance/edit/:id" element={<OpeningBalanceEdit />} />
            <Route path="opening-balance/revert/:id" element={<OpeningBalanceRevert />} />

            <Route path="opening-balance-material" element={<OpeningBalanceMaterial />} />
            <Route path="opening-balance-material/add" element={<OpeningBalanceMaterialAdd />} />
            <Route
              path="opening-balance-material/detail/:id"
              element={<OpeningBalanceMaterialDetail />}
            />
            <Route
              path="opening-balance-material/edit/:id"
              element={<OpeningBalanceMaterialEdit />}
            />
            <Route
              path="opening-balance-material/revert/:id"
              element={<OpeningBalanceMaterialRevert />}
            />

            <Route path="trial-balance" element={<GeneralEdger />} />
            <Route path="cross-chek-pajak" element={<CrossChekPajakPage />} />
            <Route path="cross-chek-pajak/add/:id" element={<CrossChekPajakAdd />} />
            <Route path="cross-chek-pajak/detail/:id" element={<CrossChekPajakDetail />} />
            <Route path="cross-chek-pajak/edit/:id" element={<CrossChekPajakUpdate />} />
            <Route path="cross-chek-pajak/rn/add/:id" element={<CrossChekPajakRNAdd />} />
            <Route path="cross-chek-pajak/rn/detail/:id" element={<CrossChekPajakRNDetail />} />
            <Route path="cross-chek-pajak/rn/edit/:id" element={<CrossChekPajakRNUpdate />} />

            <Route path="invoice" element={<InvoicePage />} />
            <Route path="invoice/add" element={<InvoiceAdd />} />
            <Route path="invoice/edit/:id" element={<InvoiceUpdate />} />
            <Route path="invoice/detail/:id" element={<InvoiceDetail />} />
            <Route path="invoice-rn" element={<InvoicePageRN />} />
            <Route path="invoice-rn/add" element={<InvoiceAddRN />} />
            <Route path="invoice-rn/edit/:id" element={<InvoiceUpdateRN />} />
            <Route path="invoice-rn/detail/:id" element={<InvoiceDetailRN />} />
            <Route path="invoice-rn-ekspor" element={<InvoicePageEksporRN />} />
            <Route path="invoice-rn-ekspor/add" element={<InvoiceAddEksporRN />} />
            <Route path="invoice-rn-ekspor/edit/:id" element={<InvoiceUpdateEksporRN />} />
            <Route path="invoice-rn-ekspor/detail/:id" element={<InvoiceDetailEkpsorRN />} />
            <Route path="laporan-penjualan" element={<SalesReportPage />} />
            <Route path="laporan-penjualan-rn" element={<SalesReportRNPage />} />
            <Route path="laporan-penjualan-rn-ekspor" element={<SalesReportEksporRNPage />} />
            <Route path="transaction-dollar" element={<TransactionDollarPage />} />
            <Route path="transaction-dollar/add" element={<TransactionDollarAdd />} />
            <Route path="transaction-dollar/edit/:id" element={<TransactionDollarUpdate />} />
            <Route path="transaction-dollar/detail/:id" element={<TransactionDollarDetail />} />
            <Route path="saldo" element={<SaldoKeuangan />} />
            <Route path="transaction" element={<TransactionPage />} />
            <Route path="transaction/add" element={<TransactionAdd />} />
            <Route path="transaction/edit/:id" element={<TransactionUpdate />} />
            <Route path="transaction/detail/:id" element={<TransactionDetail />} />
            <Route path="finance-report" element={<FinanceReportPage />} />
            <Route path="transaction-out" element={<TransactionOutPage />} />
            <Route path="transaction-out/add" element={<TransactionOutAdd />} />
            <Route path="transaction-out/edit/:id" element={<TransactionOutUpdate />} />
            <Route path="transaction-out/detail/:id" element={<TransactionOutDetail />} />
            <Route
              path="transaction-out-raw-material"
              element={<TransactionOutRawMaterialPage />}
            />
            <Route
              path="transaction-out-raw-material/add"
              element={<TransactionOutAddRawMaterial />}
            />
            <Route
              path="transaction-out-raw-material/edit/:id"
              element={<TransactionOutUpdateRawMaterial />}
            />
            <Route
              path="transaction-out-raw-material/detail/:id"
              element={<TransactionOutDetailRawMaterial />}
            />
            <Route path="raw-material" element={<RawMaterial />} />
            <Route path="raw-material/add" element={<RawMaterialAdd />} />
            <Route path="raw-material/edit/:id" element={<RawMaterialUpdate />} />
            <Route path="raw-material/detail/:id" element={<TransactionDetail />} />
            <Route path="finished-goods" element={<BarangJadiPageTransaaction />} />
            <Route path="finished-goods/add" element={<BarangJadiPageTransaactionAdd />} />
            <Route path="finished-goods/edit/:id" element={<BarangJadiPageTransaactionEdit />} />
            <Route
              path="finished-goods/detail/:id"
              element={<BarangJadiPageTransaactionDetail />}
            />
            <Route path="finished-goods-issue" element={<BarangJadiIssuePage />} />
            <Route path="finished-goods-issue/add" element={<BarangJadiIssueAdd />} />
            <Route path="finished-goods-issue/edit/:id" element={<BarangJadiIssueUpdate />} />
            <Route path="finished-goods-issue/detail/:id" element={<BarangJadiIssueDetail />} />
            <Route path="raw-material-receipt" element={<BarangMentahPage />} />
            <Route path="raw-material-receipt/add" element={<BarangMentahAdd />} />
            <Route path="raw-material-receipt/edit/:id" element={<BarangMentahUpdate />} />
            <Route path="raw-material-receipt/detail/:id" element={<BarangMentahDetail />} />
            <Route path="raw-material-issue" element={<BarangMentahIssuePage />} />
            <Route path="raw-material-issue/add" element={<BarangMentahIssueAdd />} />
            <Route path="raw-material-issue/edit/:id" element={<BarangMentahIssueUpdate />} />
            <Route path="raw-material-issue/detail/:id" element={<BarangMentahIssueDetail />} />
            <Route path="supplier" element={<SupplierPage />} />
            <Route path="supplier/add" element={<SupplierAdd />} />
            <Route path="supplier/edit/:id" element={<SupplierUpdate />} />
            <Route path="supplier/detail/:id" element={<BarangMentahIssueDetail />} />
            <Route path="akun-bank" element={<AkunBankPage />} />
            <Route path="akun-bank/add" element={<AkunBankAdd />} />
            <Route path="akun-bank/edit/:id" element={<AkunBankUpdate />} />
            <Route path="akun-bank/detail/:id" element={<AkunBankDetail />} />

            <Route path="supplier/detail/:id" element={<BarangMentahIssueDetail />} />
            <Route path="delivery-order-pra-request" element={<DeliveryOrderRequestPraPage />} />
            <Route
              path="delivery-order-pra-request/detail/:id"
              element={<DeliveryOrderRequestDetail />}
            />
            <Route path="akun" element={<AccountIndex />} />
            <Route path="akun/add" element={<AccountAdd />} />
            <Route path="akun-type/add" element={<AccountTypeAdd />} />
            <Route path="akun-type/edit/:id" element={<AccountTypeUpdate />} />
            <Route path="akun/edit/:id" element={<AccountUpdate />} />
            <Route path="akun-mapping/add" element={<AccounMappingtAdd />} />
            <Route path="akun-mapping/edit/:id" element={<AccountMappingUpdate />} />
            <Route path="jurnal-khusus" element={<JurnalKhususPage />} />
            <Route path="jurnal-khusus/detail/:id" element={<JurnalKhususDetail />} />
            <Route path="jurnal-khusus/edit/:id" element={<JurnalKhususEdit />} />
            <Route path="jurnal-khusus/revert/:id" element={<JurnalKhususRevert />} />
            <Route path="jurnal-khusus-dollar" element={<JurnalKhususDollarPage />} />
            <Route path="jurnal-khusus-dollar/detail/:id" element={<JurnalKhususDollarDetail />} />
            <Route path="jurnal-khusus-dollar/edit/:id" element={<JurnalKhususDollarEdit />} />
            <Route path="jurnal-khusus-dollar/revert/:id" element={<JurnalKhusuDollarRevert />} />
            <Route path="jurnal-umum" element={<JurnalUmumPage />} />
            <Route path="jurnal-umum/add" element={<JurnalUmumAdd />} />
            <Route path="jurnal-umum/edit/:id" element={<JurnalUmumEdit />} />
            <Route path="jurnal-umum/detail/:id" element={<JurnalKUmumDetail />} />
            <Route path="jurnal-umum/revert/:id" element={<JurnalUmumRevert />} />

            <Route path="invoice-keuangan" element={<InvoiceFinance />} />
            <Route path="invoice-keuangan/detail/rn/:id" element={<InvoiceDetailRNFinance />} />
            <Route path="invoice-keuangan/detail/ra/:id" element={<InvoiceDetailRAFinance />} />
            <Route
              path="invoice-keuangan/detail/rn-ekspor/:id"
              element={<InvoiceDetailEkpsorRNFinance />}
            />

            <Route path="buku-rekening" element={<BukuRekening />} />
            <Route path="buku-besar" element={<BukuBesar />} />

            <Route path="tax/add" element={<TaxAdd />} />
            <Route path="tax/edit/:id" element={<TaxUpdate />} />
            <Route path="tax" element={<TaxPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
