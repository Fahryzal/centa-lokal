import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
import { InventoryFilterDto } from './dto/get-warehouse.dto';

@Injectable({ scope: Scope.REQUEST })
export class WarehouseService {
	constructor(private prisma: PrismaService) {}

	async getSummary(period?: string) {
		let dateFilter: any = {};

		if (period) {
			// =========================
			// RANGE: DD/MM/YYYY-DD/MM/YYYY
			// =========================
			if (period.includes('-')) {
				const [startStr, endStr] = period.split('-').map((v) => v.trim());

				const startDate = dayjs(startStr, 'DD/MM/YYYY', true).startOf('day').toDate();

				const endDate = dayjs(endStr, 'DD/MM/YYYY', true).endOf('day').toDate();

				dateFilter = {
					gte: startDate,
					lte: endDate,
				};
			}

			// =========================
			// MONTH: MM/YYYY
			// =========================
			else if (period.includes('/')) {
				const [month, year] = period.split('/');

				const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();

				const endDate = dayjs(`${year}-${month}-01`).endOf('month').toDate();

				dateFilter = {
					gte: startDate,
					lte: endDate,
				};
			}

			// =========================
			// YEAR: YYYY
			// =========================
			else if (period.length === 4) {
				const year = period;

				const startDate = dayjs(`${year}-01-01`).startOf('year').toDate();

				const endDate = dayjs(`${year}-12-31`).endOf('year').toDate();

				dateFilter = {
					gte: startDate,
					lte: endDate,
				};
			}
		}

		// wrapper filter (biar reusable antar table)
		const transactionDateFilter = period ? { transactionDate: dateFilter } : {};

		const doDateFilter = period ? { createdAt: dateFilter } : {};

		const [
			skuFinishedGood,
			skuRawMaterialByUnit,
			stockMovementRMByUnit,
			stockMovementFGByUnit, // gabung IN & OUT FG per unit
			doByUnit, // gabung total & selected DO per unit
		] = await Promise.all([
			// SKU FG
			this.prisma.masterBarangJadi.count({
				where: { deletedAt: null },
			}),

			// SKU RM — kategorikan by unitId
			this.prisma.masterRawMaterial.groupBy({
				by: ['unitId'],
				where: { deletedAt: null },
				_count: { _all: true },
			}),

			// IN & OUT RM — kategorikan by unitId + transactionType
			this.prisma.inventoryTransactionBarangMentah.groupBy({
				by: ['unitId', 'transactionType'],
				where: {
					deletedAt: null,
					...transactionDateFilter,
				},
				_count: { _all: true },
			}),

			// IN & OUT FG — kategorikan by unitId + transactionType
			this.prisma.inventoryTransaction.groupBy({
				by: ['unitId', 'transactionType'],
				where: {
					deletedAt: null,
					...transactionDateFilter,
				},
				_count: { _all: true },
			}),

			// DO total & selected — kategorikan by unitId + selectionStatus
			this.prisma.deliveryOrder.groupBy({
				by: ['unitId', 'selectionStatus'],
				where: {
					deletedAt: null,
					...doDateFilter,
				},
				_count: { _all: true },
			}),
		]);

		// Kumpulkan semua unitId yang muncul dari seluruh groupBy
		const unitIds = [
			...new Set([
				...skuRawMaterialByUnit.map((item) => item.unitId),
				...stockMovementRMByUnit.map((item) => item.unitId),
				...stockMovementFGByUnit.map((item) => item.unitId),
				...doByUnit.map((item) => item.unitId),
			]),
		];

		const units = await this.prisma.masterUnit.findMany({
			where: { id: { in: unitIds } },
			select: { id: true, nama: true },
		});

		const getUnitName = (unitId: string) => units.find((u) => u.id === unitId)?.nama ?? 'Tanpa Unit';

		// ── SKU RM per unit ──
		const skuRawMaterial = skuRawMaterialByUnit.map((item) => ({
			unitId: item.unitId,
			unitName: getUnitName(item.unitId),
			count: item._count._all,
		}));
		const skuRawMaterialTotal = skuRawMaterial.reduce((sum, item) => sum + item.count, 0);

		// ── Stock movement RM per unit ──
		const stockMovementRMMap = new Map<string, { unitId: string; unitName: string; in: number; out: number }>();
		for (const item of stockMovementRMByUnit) {
			const key = item.unitId;
			if (!stockMovementRMMap.has(key)) {
				stockMovementRMMap.set(key, { unitId: item.unitId, unitName: getUnitName(item.unitId), in: 0, out: 0 });
			}
			const entry = stockMovementRMMap.get(key)!;
			if (item.transactionType === 'IN') entry.in = item._count._all;
			else if (item.transactionType === 'OUT') entry.out = item._count._all;
		}
		const stockMovementRawMaterialByUnit = Array.from(stockMovementRMMap.values());
		const stockInRMTotal = stockMovementRawMaterialByUnit.reduce((sum, item) => sum + item.in, 0);
		const stockOutRMTotal = stockMovementRawMaterialByUnit.reduce((sum, item) => sum + item.out, 0);

		// ── Stock movement FG per unit ──
		const stockMovementFGMap = new Map<string, { unitId: string; unitName: string; in: number; out: number }>();
		for (const item of stockMovementFGByUnit) {
			const key = item.unitId;
			if (!stockMovementFGMap.has(key)) {
				stockMovementFGMap.set(key, { unitId: item.unitId, unitName: getUnitName(item.unitId), in: 0, out: 0 });
			}
			const entry = stockMovementFGMap.get(key)!;
			if (item.transactionType === 'IN') entry.in = item._count._all;
			else if (item.transactionType === 'OUT') entry.out = item._count._all;
		}
		const stockMovementFinishedGoodByUnit = Array.from(stockMovementFGMap.values());
		const stockInFGTotal = stockMovementFinishedGoodByUnit.reduce((sum, item) => sum + item.in, 0);
		const stockOutFGTotal = stockMovementFinishedGoodByUnit.reduce((sum, item) => sum + item.out, 0);

		// ── Delivery Order per unit ──
		const doMap = new Map<string, { unitId: string; unitName: string; total: number; selected: number }>();
		for (const item of doByUnit) {
			const key = item.unitId;
			if (!doMap.has(key)) {
				doMap.set(key, { unitId: item.unitId, unitName: getUnitName(item.unitId), total: 0, selected: 0 });
			}
			const entry = doMap.get(key)!;
			entry.total += item._count._all; // akumulasi semua status masuk total
			if (item.selectionStatus === 'SELECTED') entry.selected = item._count._all;
		}
		const deliveryOrderByUnit = Array.from(doMap.values());
		const doTotalAll = deliveryOrderByUnit.reduce((sum, item) => sum + item.total, 0);
		const doSelectedAll = deliveryOrderByUnit.reduce((sum, item) => sum + item.selected, 0);

		return {
			sku: {
				finishedGood: skuFinishedGood,
				rawMaterial: skuRawMaterial,
				rawMaterialTotal: skuRawMaterialTotal,
			},
			stockMovementToday: {
				finishedGood: {
					byUnit: stockMovementFinishedGoodByUnit, // e.g. [{ unitName: 'PCS', in: 10, out: 4 }, ...]
					in: stockInFGTotal,
					out: stockOutFGTotal,
				},
				rawMaterial: {
					byUnit: stockMovementRawMaterialByUnit,
					in: stockInRMTotal,
					out: stockOutRMTotal,
				},
			},
			deliveryOrder: {
				byUnit: deliveryOrderByUnit, // e.g. [{ unitName: 'KG', total: 20, selected: 15 }, ...]
				total: doTotalAll,
				selected: doSelectedAll,
			},
		};
	}

	async getInventoryRawData(dto: InventoryFilterDto) {
		const { productId, startDate, endDate, unitId } = dto;

		const where: any = {};

		// Filter berdasarkan productId (optional)
		if (productId) {
			where.productId = productId;
		}
		if (unitId) {
			where.unitId = unitId;
		}
		const toLocalDate = (dateStr: string, hour: number, minute: number, second: number) => {
			const [y, m, d] = dateStr.split('-').map(Number);
			return new Date(Date.UTC(y, m - 1, d, hour - 7, minute, second)); // convert WIB → UTC
		};

		if (startDate || endDate) {
			where.transactionDate = {};

			if (startDate) {
				where.transactionDate.gte = toLocalDate(startDate, 0, 0, 0);
			}
			if (endDate) {
				where.transactionDate.lte = toLocalDate(endDate, 23, 59, 59);
			}
		}

		const transactions = await this.prisma.inventoryTransaction.findMany({
			where,
			include: { product: true },
			orderBy: { transactionDate: 'asc' },
		});

		return transactions.map((trx) => ({
			type: trx.transactionType === 'IN' ? 'Masuk' : 'Keluar',
			date: trx.transactionDate.toISOString().split('T')[0],
			qty: trx.quantity,
			product: trx.product.namaBarang,
			productId: trx.productId,
		}));
	}

	async getRawMaterialTransactions(dto: InventoryFilterDto) {
		const { productId, startDate, endDate } = dto;

		const where: any = {};

		if (productId) {
			where.productId = productId;
		}

		if (startDate || endDate) {
			where.transactionDate = {};

			if (startDate) {
				where.transactionDate.gte = new Date(startDate + 'T00:00:00Z');
			}
			if (endDate) {
				where.transactionDate.lte = new Date(endDate + 'T23:59:59Z');
			}
		}

		const trx = await this.prisma.inventoryTransactionBarangMentah.findMany({
			where,
			include: {
				product: true, // MasterRawMaterial
			},
			orderBy: {
				transactionDate: 'asc',
			},
		});

		const rawData = trx.map((item) => ({
			type: item.transactionType === 'IN' ? 'Masuk' : 'Keluar',
			date: item.transactionDate.toISOString().split('T')[0],
			qty: item.quantity,
			product: item.product.itemName,
		}));

		return rawData;
	}
}
