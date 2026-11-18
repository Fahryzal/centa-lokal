import { CustomLoggerService } from '@common/utils/logger/logger.service';
import { CommonModule } from '@modules/common/common.module';
import { DonwloadLogModule } from '@modules/donwload-log/donwload-log.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { LoggingMiddleware } from '@shared/middleware/logging.middleware';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { LoggingInterceptor } from '@src/config/logging-interceptor';
import { routes } from './app.routes';
import { AccountMappingModule } from './modules/akuntansi/account-mapping/account-mapping.module';
import { OpeningBalanceModule } from './modules/akuntansi/opening-balance/opening-balance.module';
import { PostJurnalModule } from './modules/akuntansi/post-jurnal/post-jurnal.module';
import { SpbsModule } from './modules/akuntansi/spbs/spbs.module';
import { AuthChallengeModule } from './modules/auth/auth-challenge/auth-challenge.module';
import { AuthChallengeService } from './modules/auth/auth-challenge/auth-challenge.service';
import { AuthentikasiModule } from './modules/auth/authentikasi/authentikasi.module';
import { AkuntansiModule } from './modules/dashboard/akuntansi/akuntansi.module';
import { MareketingRaModule } from './modules/dashboard/mareketing-ra/mareketing-ra.module';
import { WarehouseModule } from './modules/dashboard/warehouse/warehouse.module';
import { BackblazeModule } from './modules/external/backblaze/backblaze.module';
import { FinishedGoodsIssueModule } from './modules/gudang/finished-goods-issue/finished-goods-issue.module';
import { InventorisModule } from './modules/gudang/inventoris/inventoris.module';
import { ProductModule } from './modules/gudang/product/product.module';
import { RawMaterialModule } from './modules/gudang/raw-material/raw-material.module';
import { BankAccountModule } from './modules/keuangan/bank-account/bank-account.module';
import { ConsolidasiModule } from './modules/keuangan/consolidasi/consolidasi.module';
import { JurnalEntryModule } from './modules/keuangan/jurnal-entry/jurnal-entry.module';
import { PurchaseOrderTaxModule } from './modules/keuangan/purchase-order-tax/purchase-order-tax.module';
import { ReportGeneratEdgerModule } from './modules/keuangan/report-generat-edger/report-generat-edger.module';
import { ReportModule } from './modules/keuangan/report/report.module';
import { TaxModule } from './modules/keuangan/tax/tax.module';
import { TransactionModule } from './modules/keuangan/transaction/transaction.module';
import { InvoiceEksporModule } from './modules/marketing/invoice-ekspor/invoice-ekspor.module';
import { InvoiceModule } from './modules/marketing/invoice/invoice.module';
import { OrderDeleveryPraModule } from './modules/marketing/order-delevery-pra/order-delevery-pra.module';
import { OrderPoPraModule } from './modules/marketing/order-po-pra/order-po-pra.module';
import { ReportModuleSales } from './modules/marketing/report/report.module';
import { SalesPlanModule } from './modules/marketing/sales-plan/sales-plan.module';
import { AccountModule } from './modules/master/account/account.module';
import { AkunTypeModule } from './modules/master/akun-type/akun-type.module';
import { BarangJadiModule } from './modules/master/barang-jadi/barang-jadi.module';
import { BarangMentahModule } from './modules/master/barang-mentah/barang-mentah.module';
import { CustomersModule } from './modules/master/customers/customers.module';
import { GenerateCodeModule } from './modules/master/generate-code/generate-code.module';
import { KategoriModule } from './modules/master/kategori/kategori.module';
import { SatuanModule } from './modules/master/satuan/satuan.module';
import { SupplierModule } from './modules/master/supplier/supplier.module';
import { TaxMasterModule } from './modules/master/tax/tax.module';
import { UnitModule } from './modules/master/unit/unit.module';
import { ShareModuleModule } from './modules/share-module/share-module.module';
import { MenusModule } from './modules/user-management/menus/menus.module';
import { PermisionsModule } from './modules/user-management/permisions/permisions.module';
import { RolePerimisionModule } from './modules/user-management/role-perimision/role-perimision.module';
import { RolesModule } from './modules/user-management/roles/roles.module';
import { UsersModule } from './modules/user-management/users/users.module';
import { ResponseInterceptor } from './shared/response/response.interceptor';
@Module({
	imports: [
		// Module Utils
		ConfigModule.forRoot({ isGlobal: true }),
		CommonModule,
		//swagger register
		DonwloadLogModule,
		ReportModuleSales,
		UsersModule,
		SalesPlanModule,
		AuthentikasiModule,
		GenerateCodeModule,
		UnitModule,
		KategoriModule,
		SatuanModule,
		BarangJadiModule,
		BackblazeModule,
		CustomersModule,
		OrderPoPraModule,
		OrderDeleveryPraModule,
		SpbsModule,
		PurchaseOrderTaxModule,
		InvoiceModule,
		TaxModule,
		JurnalEntryModule,
		TransactionModule,
		ReportModule,
		BankAccountModule,
		InventorisModule,
		BarangMentahModule,
		RawMaterialModule,
		FinishedGoodsIssueModule,
		AccountModule,
		// Register Routes
		RouterModule.register(routes),
		SupplierModule,
		AuthChallengeModule,
		AccountMappingModule,
		AkunTypeModule,
		ProductModule,
		RolesModule,
		MenusModule,
		PermisionsModule,
		RolePerimisionModule,
		OpeningBalanceModule,
		PostJurnalModule,
		ReportGeneratEdgerModule,
		InvoiceEksporModule,
		ConsolidasiModule,
		MareketingRaModule,
		TaxMasterModule,
		AkuntansiModule,
		WarehouseModule,
		ShareModuleModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		AuthChallengeService,
		CustomLoggerService,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor, // Tambahkan ResponseInterceptor
		},
	],
})
// export class AppModule {}
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes('*');
		// consumer
		// 	.apply(ChallengeMiddleware)
		// 	.exclude({
		// 		path: 'v1/challange', // tanpa slash di depan
		// 		method: RequestMethod.ALL, // bisa juga GET/POST khusus
		// 	})
		// 	.forRoutes('*'); // middleware tetap untuk semua route selain yg di-exclude
	}
}
