import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { format } from 'date-fns';
import { id, id as idLocale } from 'date-fns/locale';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { GetBuyerDto, GetInvoiceDto, GetMareketingRaDto, GetSalesPlanDto } from './dto/get-marketing-ra.dto';
type InvoiceData = Record<number, Record<number, { type: string; value: number }[]>>;
dayjs.extend(customParseFormat);
@Injectable({ scope: Scope.REQUEST })
export class MareketingRaService {
	constructor(private readonly prisma: PrismaService) {}

	async getSummary(period?: string) {
		let dateFilter: any = {};
		let salesPlanFilter: any = {};

		if (period) {
			// ======================
			// FORMAT: DD/MM/YYYY-DD/MM/YYYY
			// ======================
			if (period.includes('-')) {
				const [startStr, endStr] = period.split('-');

				const start = dayjs(startStr.trim(), 'DD/MM/YYYY', true);
				const end = dayjs(endStr.trim(), 'DD/MM/YYYY', true);

				if (!start.isValid() || !end.isValid()) {
					throw new BadRequestException('Format period harus DD/MM/YYYY-DD/MM/YYYY');
				}
				const startDate = start.startOf('day').toDate();
				const endDate = end.endOf('day').toDate();
				dateFilter = {
					gte: startDate,
					lte: endDate,
				};

				const months: string[] = [];

				let current = dayjs(startDate).startOf('month');
				const last = dayjs(endDate).endOf('month');

				while (current.isBefore(last) || current.isSame(last, 'month')) {
					months.push(current.format('MM/YYYY'));
					current = current.add(1, 'month');
				}

				salesPlanFilter = {
					periode_month: {
						in: months,
					},
				};
			}

			// ======================
			// FORMAT: MM/YYYY
			// ======================
			else if (period.includes('/')) {
				const [month, year] = period.split('/');

				const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();

				const endDate = dayjs(`${year}-${month}-01`).endOf('month').toDate();

				dateFilter = {
					gte: startDate,
					lte: endDate,
				};

				salesPlanFilter = {
					periode_month: `${month}/${year}`,
				};
			}

			// ======================
			// FORMAT: YYYY
			// ======================
			else if (period.length === 4) {
				const startDate = dayjs(`${period}-01-01`).startOf('year').toDate();

				const endDate = dayjs(`${period}-12-31`).endOf('year').toDate();

				dateFilter = {
					gte: startDate,
					lte: endDate,
				};

				salesPlanFilter = {
					periode_month: {
						endsWith: `/${period}`,
					},
				};
			}
		}

		const [
			poTotalRa,
			poApprovedRa,
			poTotalRn,
			poApprovedRn,
			poTotalRnEkspor,
			poApprovedRnEkspor,
			spbCountRa,
			spbCountRn,
			spbCountRnEkspor,
			invoiceTotal,
			invoiceLunas,
			customerCount,
			invoiceEksporTotal,
			invoiceEksporLunas,
			salesPlanTotalRA,
			actualSalesTotalRA,
			salesPlanTotalRN,
			actualSalesTotalRN,
			salesPlanTotalRNEkspor,
			actualSalesTotalRNEkspor,
			invoiceRnTotal,
			invoiceRnLunas,
		] = await this.prisma.$transaction([
			this.prisma.purchaseOrder.aggregate({
				_count: { id: true },
				_sum: { totalAmount: true },
				where: {
					typePo: 'RA',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.purchaseOrder.aggregate({
				_count: { id: true },
				_sum: { totalAmount: true },
				where: {
					typePo: 'RA',
					status: 'APPROVED',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.purchaseOrder.aggregate({
				_count: { id: true },
				_sum: { totalAmount: true },
				where: {
					typePo: 'RN',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.purchaseOrder.aggregate({
				_count: { id: true },
				_sum: { totalAmount: true },
				where: {
					typePo: 'RN',
					status: 'APPROVED',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.purchaseOrder.aggregate({
				_count: { id: true },
				_sum: { subtotalAmount: true },
				where: {
					typePo: 'RN_EKSPOR',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.purchaseOrder.aggregate({
				_count: { id: true },
				_sum: { downPayment: true },
				where: {
					typePo: 'RN_EKSPOR',
					status: 'APPROVED',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.sPB.count({
				where: {
					typeSalesSPb: 'RA',
					deletedAt: null,
					tanggalPengiriman: dateFilter,
				},
			}),

			this.prisma.sPB.count({
				where: {
					typeSalesSPb: 'RN',
					deletedAt: null,
					tanggalPengiriman: dateFilter,
				},
			}),

			this.prisma.sPB.count({
				where: {
					typeSalesSPb: 'RN_EKSPOR',
					deletedAt: null,
					tanggalPengiriman: dateFilter,
				},
			}),

			this.prisma.invoice.aggregate({
				_count: { id: true },
				_sum: { amountWithTax: true },
				where: {
					typeInvoice: 'RA',
					deletedAt: null,
					invoiceDate: dateFilter,
				},
			}),

			this.prisma.invoice.aggregate({
				_count: { id: true },
				_sum: { amountWithTax: true },
				where: {
					typeInvoice: 'RA',
					status: 'LUNAS',
					deletedAt: null,
					invoiceDate: dateFilter,
				},
			}),

			this.prisma.customer.count({
				where: {
					deletedAt: null,
				},
			}),

			this.prisma.invoiceEkspor.aggregate({
				_count: { id: true },
				_sum: { totalCIF: true },
				where: {
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.invoiceEkspor.aggregate({
				_count: { id: true },
				_sum: { totalCIF: true },
				where: {
					status: 'LUNAS',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.salesPlan.aggregate({
				_sum: { value_rkap: true },
				where: {
					typeSalesPlan: 'RA',
					deletedAt: null,
					...salesPlanFilter,
				},
			}),

			this.prisma.purchaseOrder.aggregate({
				_sum: {
					subtotalAmount: true,
				},
				where: {
					typePo: 'RA',
					deletedAt: null,
					date: dateFilter,
				},
			}),

			this.prisma.salesPlan.aggregate({
				_sum: {
					value_rkap: true,
				},
				where: {
					typeSalesPlan: 'RN',
					deletedAt: null,
					...salesPlanFilter,
				},
			}),

			this.prisma.purchaseOrderItem.aggregate({
				_sum: {
					beratproduct: true,
				},
				where: {
					deletedAt: null,
					purchaseOrder: {
						typePo: 'RN',
						deletedAt: null,
						date: dateFilter,
					},
				},
			}),

			this.prisma.salesPlan.aggregate({
				_sum: {
					value_rkap: true,
				},
				where: {
					typeSalesPlan: 'RN_EKSPOR',
					deletedAt: null,
					...salesPlanFilter,
				},
			}),

			this.prisma.purchaseOrderItem.aggregate({
				_sum: {
					beratproduct: true,
				},
				where: {
					deletedAt: null,
					purchaseOrder: {
						typePo: 'RN_EKSPOR',
						deletedAt: null,
						date: dateFilter,
					},
				},
			}),

			this.prisma.invoice.aggregate({
				_count: { id: true },
				_sum: { amountWithTax: true },
				where: {
					typeInvoice: 'RN',
					deletedAt: null,
					invoiceDate: dateFilter,
				},
			}),

			this.prisma.invoice.aggregate({
				_count: { id: true },
				_sum: { amountWithTax: true },
				where: {
					typeInvoice: 'RN',
					status: 'LUNAS',
					deletedAt: null,
					invoiceDate: dateFilter,
				},
			}),
		]);

		return {
			purchaseOrder: {
				total: {
					count: poTotalRa._count.id,
					totalAmount: poTotalRa._sum.totalAmount || 0,
				},
				approved: {
					count: poApprovedRa._count.id,
					totalAmount: poApprovedRa._sum.totalAmount || 0,
				},
			},

			purchaseOrderRn: {
				total: {
					count: poTotalRn._count.id,
					totalAmount: poTotalRn._sum.totalAmount || 0,
				},
				approved: {
					count: poApprovedRn._count.id,
					totalAmount: poApprovedRn._sum.totalAmount || 0,
				},
			},

			purchaseOrderRnEkspor: {
				total: {
					count: poTotalRnEkspor._count.id,
					totalAmount: poTotalRnEkspor._sum.subtotalAmount || 0,
				},
				approved: {
					count: poApprovedRnEkspor._count.id,
					totalAmount: poApprovedRnEkspor._sum.downPayment || 0,
				},
			},

			spb: {
				countRa: spbCountRa,
				countRn: spbCountRn,
				countRnEkspor: spbCountRnEkspor,
			},

			invoiceLokalRA: {
				total: {
					count: invoiceTotal._count.id,
					totalAmount: invoiceTotal._sum.amountWithTax || 0,
				},
				lunas: {
					count: invoiceLunas._count.id,
					totalAmount: invoiceLunas._sum.amountWithTax || 0,
				},
			},

			invoiceEkspor: {
				total: {
					count: invoiceEksporTotal._count.id,
					totalAmount: invoiceEksporTotal._sum.totalCIF || 0,
				},
				lunas: {
					count: invoiceEksporLunas._count.id,
					totalAmount: invoiceEksporLunas._sum.totalCIF || 0,
				},
			},

			customer: {
				count: customerCount,
			},

			salesPlanVsActualRA: {
				plan: salesPlanTotalRA._sum.value_rkap || 0,
				actual: actualSalesTotalRA._sum.subtotalAmount || 0,
			},

			salesPlanVsActualRN: {
				plan: salesPlanTotalRN._sum.value_rkap || 0,
				actual: actualSalesTotalRN._sum.beratproduct || 0,
			},

			salesPlanVsActualRNEkspor: {
				plan: salesPlanTotalRNEkspor._sum.value_rkap || 0,
				actual: actualSalesTotalRNEkspor._sum.beratproduct || 0,
			},
			invoiceLokalRN: {
				total: {
					count: invoiceRnTotal._count.id,
					totalAmount: invoiceRnTotal._sum.amountWithTax || 0,
				},
				lunas: {
					count: invoiceRnLunas._count.id,
					totalAmount: invoiceRnLunas._sum.amountWithTax || 0,
				},
			},
		};
	}

	async getPurchaseOrderStats(query: GetMareketingRaDto, decoded: DecodeTokenType) {
		const { kategori, year, month, unitId, typePo } = query;

		const whereCondition: any = {};

		const KATEGORI_ALIAS: Record<string, string> = {
			PPR: 'PACKING PINTU REBUSAN',
			'PACKING PINTU REBUSAN': 'PACKING PINTU REBUSAN',
		};

		const KATEGORI_ALIAS2: Record<string, string[]> = {
			PPR: ['PPR', 'PACKING PINTU REBUSAN'],
			'PACKING PINTU REBUSAN': ['PPR', 'PACKING PINTU REBUSAN'],
		};

		if (kategori && kategori !== 'all') {
			const key = kategori.trim().toUpperCase();

			whereCondition.kategoriProduct = { in: KATEGORI_ALIAS2[key] ?? [kategori] };
		}
		console.log(whereCondition);

		// Filter Purchase Order
		whereCondition.purchaseOrder = {};

		if (year && month) {
			whereCondition.purchaseOrder.date = {
				gte: new Date(year, month - 1),
				lt: new Date(year, month),
			};
		} else if (year) {
			whereCondition.purchaseOrder.date = {
				gte: new Date(`${year}-01-01T00:00:00.000Z`),
				lte: new Date(`${year}-12-31T23:59:59.999Z`),
			};
		}

		if (unitId && !(decoded.isRoot === 'Y' || decoded.isPusat)) {
			whereCondition.purchaseOrder.unitId = unitId;
		}

		if (typePo) {
			whereCondition.purchaseOrder.typePo = typePo;
		}

		const items = await this.prisma.purchaseOrderItem.findMany({
			where: whereCondition,
			include: {
				purchaseOrder: {
					select: {
						date: true,
						status: true,
						unitId: true,
						typePo: true,
					},
				},
			},
		});

		const grouped = new Map<
			string,
			{
				month: string;
				year: number;
				status: string;
				kategori: string;
				value: number;
			}
		>();

		for (const item of items) {
			const month = format(item.purchaseOrder.date, 'MMM', {
				locale: idLocale,
			});

			const year = item.purchaseOrder.date.getFullYear();

			const status = this.mapStatus(item.purchaseOrder.status);

			const kategori = KATEGORI_ALIAS[item.kategoriProduct] ?? item.kategoriProduct ?? 'Unknown';

			const key = `${year}-${month}-${status}-${kategori}`;

			if (!grouped.has(key)) {
				grouped.set(key, {
					month,
					year,
					status,
					kategori,
					value: 0,
				});
			}

			grouped.get(key)!.value += Number(item.quantity);
		}

		return Array.from(grouped.values());
	}

	async getInvoiceDataByPeriod(query: GetInvoiceDto): Promise<InvoiceData> {
		const { year, month, unitId, typePo } = query;

		if (typePo !== 'RN_EKSPOR') {
			const whereCondition: any = {
				typeInvoice: typePo,
			};

			if (year && month) {
				const start = new Date(year, month - 1, 1); // Awal bulan
				const end = new Date(year, month, 0, 23, 59, 59, 999); // Akhir bulan (tanggal terakhir bulan itu)

				whereCondition.invoiceDate = {
					gte: start,
					lte: end,
				};
			}

			if (unitId) {
				whereCondition.masterUnitId = unitId;
			}
			const invoices = await this.prisma.invoice.findMany({
				where: whereCondition,
				select: {
					invoiceDate: true,
					status: true,
				},
			});

			const result: InvoiceData = {};

			invoices.forEach((inv) => {
				const year = inv.invoiceDate.getFullYear();
				const month = inv.invoiceDate.getMonth() + 1; // bulan 1–12

				if (!result[year]) result[year] = {};
				if (!result[year][month]) {
					result[year][month] = [
						{ type: 'Hutang', value: 0 },
						{ type: 'Lunas', value: 0 },
						{ type: 'Selesai', value: 0 },
					];
				}

				// cari index untuk update
				const hutangIdx = result[year][month].findIndex((d) => d.type === 'Hutang');
				const lunasIdx = result[year][month].findIndex((d) => d.type === 'Lunas');
				// const selesaiIdx = result[year][month].findIndex((d) => d.type === 'Selesai');

				if (inv.status === 'HUTANG') {
					result[year][month][hutangIdx].value += 1;
				} else if (inv.status === 'LUNAS') {
					result[year][month][lunasIdx].value += 1;
					// result[year][month][selesaiIdx].value += 1; // sama dengan lunas
				}
			});

			return result;
		} else {
			const whereCondition: any = {
				spb: {
					typeSalesSPb: 'RN_EKSPOR',
				},
			};

			if (year && month) {
				const start = new Date(year, month - 1, 1); // Awal bulan
				const end = new Date(year, month, 0, 23, 59, 59, 999); // Akhir bulan (tanggal terakhir bulan itu)

				whereCondition.date = {
					gte: start,
					lte: end,
				};
			}

			if (unitId) {
				whereCondition.masterUnitId = unitId;
			}

			const invoices = await this.prisma.invoiceEkspor.findMany({
				where: whereCondition,
				select: {
					date: true,
					status: true,
					spb: true,
				},
			});

			const result: InvoiceData = {};

			invoices.forEach((inv) => {
				const year = inv.date.getFullYear();
				const month = inv.date.getMonth() + 1; // bulan 1–12

				if (!result[year]) result[year] = {};
				if (!result[year][month]) {
					result[year][month] = [
						{ type: 'Hutang', value: 0 },
						{ type: 'Lunas', value: 0 },
						{ type: 'Selesai', value: 0 },
					];
				}

				// cari index untuk update
				const hutangIdx = result[year][month].findIndex((d) => d.type === 'Hutang');
				const lunasIdx = result[year][month].findIndex((d) => d.type === 'Lunas');
				// const selesaiIdx = result[year][month].findIndex((d) => d.type === 'Selesai');

				if (inv.status === 'HUTANG') {
					result[year][month][hutangIdx].value += 1;
				} else if (inv.status === 'LUNAS') {
					result[year][month][lunasIdx].value += 1;
					// result[year][month][selesaiIdx].value += 1; // sama dengan lunas
				}
			});

			return result;
		}
	}

	mapStatus(statusEnum: string) {
		switch (statusEnum) {
			case 'WAITING':
				return 'Draft';
			case 'ON_DELIVERY':
				return 'Pengiriman';
			case 'DONE':
				return 'Selesai';
			default:
				return statusEnum;
		}
	}

	async getPurchaseOrderStatsTop5(query: GetMareketingRaDto) {
		const { kategori, year, typePo } = query;
		const whereCondition: any = {
			OR: [{ status: 'DELIVERY' }, { status: 'APPROVED' }],
		};

		if (kategori && kategori !== 'all') {
			whereCondition.items = {
				some: { kategoriProduct: kategori },
			};
		}

		// if (unitId) whereCondition.unitId = unitId;
		if (typePo) whereCondition.typePo = typePo;

		if (year) {
			whereCondition.date = {
				gte: new Date(`${year}-01-01T00:00:00.000Z`),
				lte: new Date(`${year}-12-31T23:59:59.999Z`),
			};
		}

		const orders = await this.prisma.purchaseOrder.findMany({
			where: whereCondition,
			include: { items: true },
		});

		// Mapping kategori yang mau digabung jadi satu label
		const KATEGORI_ALIAS: Record<string, string> = {
			PPR: 'PACKING PINTU REBUSAN',
			'PACKING PINTU REBUSAN': 'PACKING PINTU REBUSAN',
		};

		// value per year -> per kategori -> per month
		const dataByYear: Record<string, Record<string, Record<string, number>>> = {};

		for (const order of orders) {
			const orderYear = dayjs(order.date).format('YYYY');
			const month = dayjs(order.date).format('MMM');

			for (const item of order.items) {
				const rawKategori = item.kategoriProduct || 'Unknown';
				const kategoriItem = KATEGORI_ALIAS[rawKategori] || rawKategori;
				const valueItem = Number(item.quantity * item.priceProduct || 0);

				dataByYear[orderYear] ??= {};
				dataByYear[orderYear][kategoriItem] ??= {};
				dataByYear[orderYear][kategoriItem][month] = (dataByYear[orderYear][kategoriItem][month] || 0) + valueItem;
			}
		}

		const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		const resultByYear: Record<string, { month: string; value: number; kategori: string }[]> = {};

		for (const [yr, kategoriMap] of Object.entries(dataByYear)) {
			const result: { month: string; value: number; kategori: string }[] = [];

			for (const kat of Object.keys(kategoriMap)) {
				for (const month of MONTHS) {
					result.push({
						month,
						value: kategoriMap[kat][month] || 0,
						kategori: kat,
					});
				}
			}

			resultByYear[yr] = result;
		}

		return resultByYear;
	}
	async getPlanVsActual(query: GetSalesPlanDto) {
		const { year, typePo, unitId } = query;

		const whereCondition: any = {};

		if (unitId) {
			whereCondition.unitId = unitId;
		}

		if (year) {
			whereCondition.date = {
				gte: new Date(`${year}-01-01T00:00:00.000Z`),
				lte: new Date(`${year}-12-31T23:59:59.999Z`),
			};
		}
		// 1️⃣ Ambil semua data SalesPlan
		const salesPlans = await this.prisma.salesPlan.findMany({
			where: { ...whereCondition, typeSalesPlan: typePo },
		});

		// 2️⃣ Ambil semua PurchaseOrder (actual)
		const purchaseOrders = await this.prisma.purchaseOrder.findMany({
			where: { ...whereCondition, OR: [{ status: 'DELIVERY' }, { status: 'APPROVED' }], typePo },
			include: {
				items: true,
			},
		});

		// 3️⃣ Mapping data plan per tahun dan bulan
		const planMap: Record<string, Record<string, number>> = {};
		for (const plan of salesPlans) {
			const [year, month] = dayjs(plan.date).format('YYYY-MM').split('-');
			if (!planMap[year]) planMap[year] = {};
			if (!planMap[year][month]) planMap[year][month] = 0;
			planMap[year][month] += Number(plan.value_rkap);
		}

		// 4️⃣ Mapping data actual per tahun dan bulan
		const actualMap: Record<string, Record<string, number>> = {};
		for (const po of purchaseOrders) {
			const year = po.date.getFullYear().toString();
			const month = (po.date.getMonth() + 1).toString().padStart(2, '0');
			const weightTotal = po.items.reduce((acc, value) => acc + value.total, 0);
			if (!actualMap[year]) actualMap[year] = {};
			if (!actualMap[year][month]) actualMap[year][month] = 0;
			actualMap[year][month] += Number(weightTotal);
		}
		// 5️⃣ Format data akhir
		const result: Record<string, { month: string; plan: number; actual: number }[]> = {};

		for (const year of Object.keys(planMap)) {
			result[year] = [];
			for (let m = 1; m <= 12; m++) {
				const monthKey = m.toString().padStart(2, '0');
				const monthName = format(new Date(Number(year), m - 1, 1), 'MMM', { locale: id });

				result[year].push({
					month: monthName,
					plan: planMap[year][monthKey] || 0,
					actual: actualMap[year]?.[monthKey] || 0,
				});
			}
		}

		return result;
	}

	async getBuyerRecord(query: GetBuyerDto) {
		const { namaBarang, typePo, unitId, year, customerName, month } = query;
		const whereCondition: any = {};

		if (customerName) {
			whereCondition.customerName = customerName;
		}

		if (namaBarang) {
			whereCondition.items = {
				some: {
					namabarangProduct: namaBarang,
				},
			};
		}

		if (typePo) {
			whereCondition.typePo = typePo;
		}

		if (unitId) {
			whereCondition.unitId = unitId;
		}

		console.log('whereCondition', month);

		if (year && month) {
			const lastDay = new Date(Number(year), Number(month), 0).getDate();

			whereCondition.date = {
				gte: new Date(`${year}-${month}-01T00:00:00+07:00`),
				lte: new Date(`${year}-${month}-${lastDay}T23:59:59+07:00`),
			};
		}

		const purchaseOrders = await this.prisma.purchaseOrder.findMany({
			where: whereCondition,
			include: {
				customer: true,
				items: true,
			},
		});

		const buyerData = purchaseOrders.flatMap((po) =>
			po.items
				.filter((i) => (namaBarang ? i.namabarangProduct.toLowerCase() === namaBarang.toLowerCase() : true))
				.map((item) => ({
					company: po.customerName ?? po.customer.name,
					year: dayjs(po.date).format('YYYY'),
					month: dayjs(po.date).format('MMM'), // Jan, Feb, dll
					product: item.namabarangProduct,
					payment: Number(item.quantity) * Number(item.priceProduct), // atau pakai unitPrice * quantity
					items: item.quantity ?? 0,
				})),
		);

		const groupedData = Object.values(
			buyerData.reduce(
				(acc, curr) => {
					const key = `${curr.company}_${curr.year}_${curr.month}_${curr.product}`;
					if (!acc[key]) {
						acc[key] = { ...curr };
					} else {
						acc[key].payment += curr.payment;
						acc[key].items += curr.items;
					}
					return acc;
				},
				{} as Record<string, (typeof buyerData)[number]>,
			),
		);

		return groupedData;
	}

	async getProductCategory() {
		const categories = await this.prisma.masterKategoriBarangJadi.findMany({
			select: {
				nama: true,
			},
			orderBy: {
				nama: 'asc',
			},
		});

		return categories.map((c) => c.nama);
	}
}
