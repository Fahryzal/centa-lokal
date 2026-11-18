import { Routes } from '@nestjs/core';
import { DonwloadLogModule } from '@modules/donwload-log/donwload-log.module';
import { UsersModule } from './modules/user-management/users/users.module';
import { SalesPlanModule } from './modules/marketing/sales-plan/sales-plan.module';
import { AuthentikasiModule } from './modules/auth/authentikasi/authentikasi.module';
import { GenerateCodeModule } from './modules/master/generate-code/generate-code.module';
import { UnitModule } from './modules/master/unit/unit.module';
import { KategoriModule } from './modules/master/kategori/kategori.module';
import { SatuanModule } from './modules/master/satuan/satuan.module';
import { BarangJadiModule } from './modules/master/barang-jadi/barang-jadi.module';
import { CustomersModule } from './modules/master/customers/customers.module';
import { BackblazeModule } from './modules/external/backblaze/backblaze.module';
import { OrderPoPraModule } from './modules/marketing/order-po-pra/order-po-pra.module';
import { OrderDeleveryPraModule } from './modules/marketing/order-delevery-pra/order-delevery-pra.module';
import { SpbsModule } from './modules/akuntansi/spbs/spbs.module';
import { PurchaseOrderTaxModule } from './modules/keuangan/purchase-order-tax/purchase-order-tax.module';
import { InvoiceModule } from './modules/marketing/invoice/invoice.module';
import { TaxModule } from './modules/keuangan/tax/tax.module';
import { JurnalEntryModule } from './modules/keuangan/jurnal-entry/jurnal-entry.module';
import { TransactionModule } from './modules/keuangan/transaction/transaction.module';
import { ReportModule } from './modules/keuangan/report/report.module';
import { BankAccountModule } from './modules/keuangan/bank-account/bank-account.module';
import { InventorisModule } from './modules/gudang/inventoris/inventoris.module';
import { BarangMentahModule } from './modules/master/barang-mentah/barang-mentah.module';
import { RawMaterialModule } from './modules/gudang/raw-material/raw-material.module';
import { AccountModule } from './modules/master/account/account.module';
import { SupplierModule } from './modules/master/supplier/supplier.module';
import { AuthChallengeModule } from './modules/auth/auth-challenge/auth-challenge.module';
import { ReportModuleSales } from './modules/marketing/report/report.module';
import { AccountMappingModule } from './modules/akuntansi/account-mapping/account-mapping.module';
import { AkunTypeModule } from './modules/master/akun-type/akun-type.module';
import { ProductModule } from './modules/gudang/product/product.module';
import { RolesModule } from './modules/user-management/roles/roles.module';
import { MenusModule } from './modules/user-management/menus/menus.module';
import { PermisionsModule } from './modules/user-management/permisions/permisions.module';
import { RolePerimisionModule } from './modules/user-management/role-perimision/role-perimision.module';
import { OpeningBalanceModule } from './modules/akuntansi/opening-balance/opening-balance.module';
import { PostJurnalModule } from './modules/akuntansi/post-jurnal/post-jurnal.module';
import { ReportGeneratEdgerModule } from './modules/keuangan/report-generat-edger/report-generat-edger.module';
import { InvoiceEksporModule } from './modules/marketing/invoice-ekspor/invoice-ekspor.module';
import { ConsolidasiModule } from './modules/keuangan/consolidasi/consolidasi.module';
import { MareketingRaModule } from './modules/dashboard/mareketing-ra/mareketing-ra.module';
import { TaxMasterModule } from './modules/master/tax/tax.module';
import { WarehouseModule } from './modules/dashboard/warehouse/warehouse.module';
import { AkuntansiModule } from './modules/dashboard/akuntansi/akuntansi.module';

export const routes: Routes = [
	{
		path: 'download-log',
		module: DonwloadLogModule,
	},
	{
		path: 'files-upload',
		module: BackblazeModule,
	},
	{
		path: 'challange',
		module: AuthChallengeModule,
	},
	{
		path: 'dashboard',
		children: [
			{
				path: 'marketing',
				module: MareketingRaModule,
			},
			{
				path: 'warehouse',
				module: WarehouseModule,
			},
			{
				path: 'akuntansi',
				module: AkuntansiModule,
			},
		],
	},
	{
		path: 'master',
		children: [
			{
				path: 'generate-code',
				module: GenerateCodeModule,
			},
			{
				path: 'unit',
				module: UnitModule,
			},
			{
				path: 'kategori',
				module: KategoriModule,
			},
			{
				path: 'satuan',
				module: SatuanModule,
			},
			{
				path: 'barang-jadi',
				module: BarangJadiModule,
			},
			{
				path: 'barang-mentah',
				module: BarangMentahModule,
			},
			{
				path: 'customer',
				module: CustomersModule,
			},
			{
				path: 'account',
				module: AccountModule,
			},
			{
				path: 'supplier',
				module: SupplierModule,
			},
			{
				path: 'akun-type',
				module: AkunTypeModule,
			},
			{
				path: 'tax',
				module: TaxMasterModule,
			},
		],
	},
	{
		path: 'user-management',
		children: [
			{
				path: 'users',
				module: UsersModule,
			},
			{
				path: 'roles',
				module: RolesModule,
			},
			{
				path: 'menus',
				module: MenusModule,
			},
			{
				path: 'permision',
				module: PermisionsModule,
			},
			{
				path: 'role-permision',
				module: RolePerimisionModule,
			},
		],
	},
	{
		path: 'authentikasi',
		children: [
			{
				path: 'login',
				module: AuthentikasiModule,
			},
		],
	},
	{
		path: 'marketing',
		children: [
			{
				path: 'sales-plan',
				module: SalesPlanModule,
			},
			{
				path: 'order-po-pra',
				module: OrderPoPraModule,
			},
			{
				path: 'order-delevery-pra',
				module: OrderDeleveryPraModule,
			},
			{
				path: 'invoice',
				module: InvoiceModule,
			},
			{
				path: 'report',
				module: ReportModuleSales,
			},
			{
				path: 'sale',
				module: ProductModule,
			},
			{
				path: 'invoice-ekspor',
				module: InvoiceEksporModule,
			},
		],
	},
	{
		path: 'akuntansi',
		children: [
			{
				path: 'spbs',
				module: SpbsModule,
			},
			{
				path: 'account-mapping',
				module: AccountMappingModule,
			},
			{
				path: 'opening-balance',
				module: OpeningBalanceModule,
			},
			{
				path: 'post-jurnal',
				module: PostJurnalModule,
			},
		],
	},
	{
		path: 'keuangan',
		children: [
			{
				path: 'purchase-order-tax',
				module: PurchaseOrderTaxModule,
			},
			{
				path: 'tax',
				module: TaxModule,
			},
			{
				path: 'jurnal-entry',
				module: JurnalEntryModule,
			},
			{
				path: 'transaction',
				module: TransactionModule,
			},
			{
				path: 'report',
				module: ReportModule,
			},
			{
				path: 'bank-account',
				module: BankAccountModule,
			},
			{
				path: 'report-general-edger',
				module: ReportGeneratEdgerModule,
			},
			{
				path: 'report-consolidasi',
				module: ConsolidasiModule,
			},
		],
	},
	{
		path: 'gudang',
		children: [
			{
				path: 'product',
				module: InventorisModule,
			},
			{
				path: 'barang-mentah',
				module: RawMaterialModule,
			},
		],
	},
];
