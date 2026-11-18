import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '@src/modules/common/prisma.service';
import { ShareModuleService } from '@src/modules/share-module/share-module.service';
import { nowWIB } from '@src/shared/utils/glolabalFunc';

@Injectable({ scope: Scope.REQUEST })
export class GenerateCodeService {
	constructor(
		private prisma: PrismaService,
		private shareModuleService: ShareModuleService,
	) {}
	async createJournal(plus = 1) {
		const code = await this.shareModuleService.getNextCode('JournalEntry', 'numberJurnal', 'JRN', plus);
		return code;
	}

	async generateUnitCode(): Promise<string> {
		const countData = await this.prisma.masterUnit.count();
		const nextId = countData + 1;
		return `UNIT-${String(nextId).padStart(4, '0')}`;
	}

	async generateKtgCode(): Promise<string> {
		const countData = await this.prisma.masterKategoriBarangJadi.count();

		const nextId = countData + 1;
		return `KTG-${String(nextId).padStart(4, '0')}`;
	}

	async generateSatuanCode(): Promise<string> {
		const countData = await this.prisma.masterSatuan.count();
		const nextId = countData + 1;
		return `STN-${String(nextId).padStart(4, '0')}`;
	}

	async generateCustomerCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.customer.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
			},
		});

		const nextId = countData + 1;
		return `CUS/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generatePoCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.purchaseOrder.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
				typePo: 'RA',
			},
		});

		const nextId = countData + 1;
		return `PO/RA/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generatePoRNCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.purchaseOrder.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
				typePo: 'RN',
			},
		});

		const nextId = countData + 1;
		return `PO/RN/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generatePoEksporRNCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.purchaseOrder.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
				typePo: 'RN_EKSPOR',
			},
		});

		const nextId = countData + 1;
		return `PO/RN/EKS/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generateInvoiceCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.invoice.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
				typeInvoice: 'RA',
			},
		});

		const nextId = countData + 1;
		return `INV/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generateTransactionCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.cashBankTransaction.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
			},
		});

		const nextId = countData + 1;
		return `TRX/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generateBarangjadiCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.masterBarangJadi.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
			},
		});

		const nextId = countData + 1;
		return `BRG/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generateMentahCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.masterRawMaterial.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
			},
		});

		const nextId = countData + 1;
		return `RWMT/${month}-${year}-${String(nextId).padStart(4, '0')}`;
	}

	async generateSPBCode(): Promise<string> {
		const currentDate = nowWIB();
		const year = currentDate.getFullYear().toString();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

		const countData = await this.prisma.sPB.count({
			where: {
				createdAt: {
					gte: new Date(`${year}-${month}-01T00:00:00Z`),
					lt: new Date(
						new Date(`${year}-${month}-01T00:00:00Z`).setMonth(new Date(`${year}-${month}-01T00:00:00Z`).getMonth() + 1),
					),
				},
			},
		});
		const nextId = countData + 1;
		return `SPB/${month}/${year}/${String(nextId).padStart(4, '0')}`;
	}

	async generateJurnalCode(): Promise<string> {
		const numberJurnal = await this.createJournal();
		return numberJurnal;
	}

	async generateInvoiceEksporCode(): Promise<string> {
		const countData = await this.prisma.invoiceEkspor.count();
		const currentYear = nowWIB().getFullYear();
		const nextId = countData + 1;
		const numberJurnal = `IKN.PPN/INV/PRPNE/${String(nextId).padStart(4, '0')}/${currentYear}`;
		// example: IKN.PPN/INV/PRPNE/007/2025
		return numberJurnal;
	}
}
