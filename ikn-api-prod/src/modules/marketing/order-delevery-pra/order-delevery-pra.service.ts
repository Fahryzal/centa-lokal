import { Injectable, Scope } from '@nestjs/common';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { CreateOrderDeleveryPraDto } from './dto/create-order-delevery-pra.dto';
import { GetDeliveryOrderPRADto } from './dto/get-order-delevery-pra.dto';
import { UpdateOrderDeleveryPraDto } from './dto/update-order-delevery-pra.dto';

@Injectable({ scope: Scope.REQUEST })
export class OrderDeleveryPraService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createOrderDeleveryPraDto: CreateOrderDeleveryPraDto, decoded: DecodeTokenType) {
		const result = await this.prisma.$transaction(async (tx) => {
			const purchaseOrder = await tx.purchaseOrder.findUniqueOrThrow({
				where: {
					id: createOrderDeleveryPraDto.purchaseOrderId,
				},
				include: {
					items: true,
				},
			});

			if (createOrderDeleveryPraDto.typeSalesDelivery === 'RA') {
				if (purchaseOrder.typePo !== 'RA') {
					throw new Error('Quantity split hanya diperbolehkan untuk PO RA');
				}

				if (!createOrderDeleveryPraDto.items?.length) {
					throw new Error('Item Delivery Order RA harus diisi');
				}

				const previousDetails = await tx.deliveryOrderDetail.findMany({
					where: {
						DeliveryOrder: {
							purchaseOrderId: purchaseOrder.id,
							deletedAt: null,
						},
						deletedAt: null,
					},
					select: {
						purchaseOrderItemId: true,
						qtyKirim: true,
					},
				});

				const totalAlreadySent = new Map<string, number>();

				for (const detail of previousDetails) {
					const current = totalAlreadySent.get(detail.purchaseOrderItemId) ?? 0;

					totalAlreadySent.set(detail.purchaseOrderItemId, current + (detail.qtyKirim ?? 0));
				}

				const requestedItemIds = new Set<string>();
				const deliveryDetails = [];

				for (const requestedItem of createOrderDeleveryPraDto.items) {
					if (requestedItemIds.has(requestedItem.purchaseOrderItemId)) {
						throw new Error(`Purchase Order Item ${requestedItem.purchaseOrderItemId} dikirim lebih dari satu kali`);
					}

					requestedItemIds.add(requestedItem.purchaseOrderItemId);

					const purchaseOrderItem = purchaseOrder.items.find((item) => item.id === requestedItem.purchaseOrderItemId);

					if (!purchaseOrderItem) {
						throw new Error(`Purchase Order Item ${requestedItem.purchaseOrderItemId} tidak ditemukan pada Purchase Order`);
					}

					const quantityPO = purchaseOrderItem.quantity ?? 0;
					const alreadySent = totalAlreadySent.get(purchaseOrderItem.id) ?? 0;
					const remainingQuantity = quantityPO - alreadySent;
					const qtyKirim = Number(requestedItem.qtyKirim);
					const priceProduct = Number(purchaseOrderItem.priceProduct);

					if (remainingQuantity <= 0) {
						throw new Error(`Quantity ${purchaseOrderItem.namabarangProduct} sudah habis dikirim`);
					}

					if (qtyKirim <= 0) {
						throw new Error(`Qty kirim ${purchaseOrderItem.namabarangProduct} harus lebih dari 0`);
					}

					if (qtyKirim > remainingQuantity) {
						throw new Error(
							`Qty kirim ${purchaseOrderItem.namabarangProduct} melebihi sisa quantity. Sisa quantity: ${remainingQuantity}`,
						);
					}

					deliveryDetails.push({
						id: crypto.randomUUID(),
						purchaseOrderItemId: purchaseOrderItem.id,
						productId: purchaseOrderItem.productId,
						quantity: quantityPO,
						qtyKirim,
						unitPrice: priceProduct,
						total: qtyKirim * priceProduct,
						orderNumber: purchaseOrderItem.orderNumber ?? purchaseOrder.orderNumber,
						customerName: purchaseOrder.customerName,
						stockProduct: purchaseOrderItem.stockProduct,
						priceProduct: purchaseOrderItem.priceProduct,
						kodeBarangProduct: purchaseOrderItem.kodeBarangProduct,
						namabarangProduct: purchaseOrderItem.namabarangProduct,
						namabarangProductInvoice: purchaseOrderItem.namabarangProductInvoice,
						spesifikasiProduct: purchaseOrderItem.spesifikasiProduct,
						beratproduct: purchaseOrderItem.beratproduct,
						kategoriProduct: purchaseOrderItem.kategoriProduct,
						satuanProduct: purchaseOrderItem.satuanProduct,
						unitProduct: purchaseOrderItem.unitProduct,
					});
				}

				const totalAmount = deliveryDetails.reduce((total, detail) => total + detail.total, 0);

				const au58 = await tx.aU58.create({
					data: {
						purchaseOrderId: purchaseOrder.id,
						documentNumber: createOrderDeleveryPraDto.au58Number ?? '',
						au58Date: createOrderDeleveryPraDto.au58Date ?? null,
						description: purchaseOrder.description,
					},
				});

				const deliveryOrder = await tx.deliveryOrder.create({
					data: {
						staffId: decoded.id,
						unitId: decoded.unitId,
						purchaseOrderId: purchaseOrder.id,
						typeSalesDelivery: createOrderDeleveryPraDto.typeSalesDelivery,
						au58Id: au58.id,
						totalAmount,
					},
				});

				for (const detail of deliveryDetails) {
					await tx.deliveryOrderDetail.create({
						data: {
							...detail,
							deliveryOrderId: deliveryOrder.id,
						},
					});
				}

				const allDetails = await tx.deliveryOrderDetail.findMany({
					where: {
						DeliveryOrder: {
							purchaseOrderId: purchaseOrder.id,
							deletedAt: null,
						},
						deletedAt: null,
					},
					select: {
						purchaseOrderItemId: true,
						qtyKirim: true,
					},
				});

				const totalAllocated = new Map<string, number>();

				for (const detail of allDetails) {
					const current = totalAllocated.get(detail.purchaseOrderItemId) ?? 0;

					totalAllocated.set(detail.purchaseOrderItemId, current + (detail.qtyKirim ?? 0));
				}

				const isFullyAllocated = purchaseOrder.items.every((item) => {
					const allocated = totalAllocated.get(item.id) ?? 0;

					return allocated >= (item.quantity ?? 0);
				});

				await tx.purchaseOrder.update({
					where: {
						id: purchaseOrder.id,
					},
					data: {
						status: 'DELIVERY',
						selectionStatus: isFullyAllocated ? 'SELECTED' : 'NOT_SELECTED',
					},
				});

				return {
					purchaseOrder,
					au58,
					deliveryOrder,
				};
			}

			const au58 = await tx.aU58.create({
				data: {
					purchaseOrderId: createOrderDeleveryPraDto.purchaseOrderId,
					documentNumber: createOrderDeleveryPraDto.au58Number ?? '',
					au58Date: createOrderDeleveryPraDto.au58Date ?? null,
					description: purchaseOrder.description,
				},
			});

			const deliveryOrder = await tx.deliveryOrder.create({
				data: {
					staffId: decoded.id,
					unitId: decoded.unitId,
					purchaseOrderId: createOrderDeleveryPraDto.purchaseOrderId,
					typeSalesDelivery: createOrderDeleveryPraDto.typeSalesDelivery,
					au58Id: au58.id,
				},
			});

			await tx.purchaseOrder.update({
				where: {
					id: createOrderDeleveryPraDto.purchaseOrderId,
				},
				data: {
					status: 'DELIVERY',
					selectionStatus: 'SELECTED',
				},
			});

			return {
				purchaseOrder,
				au58,
				deliveryOrder,
			};
		});

		return result;
	}

	async findAll(query: GetDeliveryOrderPRADto, dataToken: DecodeTokenType) {
		const {
			page = 1,
			limit = 10,
			status,
			selectionStatus,
			typeSalesDelivery,
			date,
			orderNumber,
			customerName,
			franco,
			address,
			description,
			subtotalAmount,
		} = query;

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};
		// if (dataToken.isRoot !== 'Y' || !dataToken.isPusat) {
		// 	whereCondition.unitId = dataToken.unitId;
		// }
		// Jika parameter `unit` ada, tambahkan filter `unit`
		if (status) {
			whereCondition.status = {
				contains: status,
				mode: 'insensitive',
			};
		}

		if (selectionStatus) {
			whereCondition.selectionStatus = selectionStatus;
		}

		if (typeSalesDelivery) {
			whereCondition.typeSalesDelivery = typeSalesDelivery;
		}

		if (dataToken.roles.some((item) => item === 'admin' && dataToken.isRoot !== 'Y' && !dataToken.isPusat)) {
			whereCondition.staffId = dataToken.id;
		}

		//dari join
		if (date) {
			const start = dayjs(date).startOf('day').toDate();
			const end = dayjs(date).endOf('day').toDate();

			whereCondition.purchaseOrder = {
				date: {
					gte: start,
					lte: end,
				},
			};
		}
		if (orderNumber) {
			whereCondition.purchaseOrder = {
				orderNumber: {
					contains: orderNumber,
					mode: 'insensitive',
				},
			};
		}

		if (customerName) {
			whereCondition.purchaseOrder = {
				customerName: {
					contains: customerName,
					mode: 'insensitive',
				},
			};
		}

		if (franco) {
			whereCondition.purchaseOrder = {
				franco: {
					contains: franco,
					mode: 'insensitive',
				},
			};
		}

		if (subtotalAmount) {
			whereCondition.purchaseOrder = {
				subtotalAmount: subtotalAmount,
			};
		}

		//join deep
		if (address) {
			whereCondition.purchaseOrder = {
				customer: {
					address: {
						contains: address,
						mode: 'insensitive',
					},
				},
			};
		}

		if (description) {
			whereCondition.purchaseOrder = {
				description: {
					contains: description,
					mode: 'insensitive',
				},
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.deliveryOrder.findMany({
				include: {
					au58: true,
					purchaseOrder: {
						include: {
							customer: true,
							items: {
								include: {
									product: true,
								},
							},
						},
					},
				},
				skip,
				take,
				where: whereCondition,
				orderBy: {
					createdAt: 'desc',
				},
			}),
			this.prisma.deliveryOrder.count({ where: whereCondition }),
		]);

		return {
			data,
			page: +page,
			limit: +limit,
			totalData,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: string) {
		return this.prisma.deliveryOrder.findUnique({
			where: { id },
			include: {
				au58: true,
				DeliveryOrderDetail: {
					where: {
						deletedAt: null,
					},
					include: {
						PurchaseOrderItem: {
							include: {
								product: true,
							},
						},
						MasterBarangJadi: true,
						itemsSPB: true,
					},
				},
				purchaseOrder: {
					include: {
						additionalCharges: true,
						customer: true,
						PurchaseOrderTax: true,
						items: {
							include: {
								product: true,
							},
						},
					},
				},
			},
		});
	}

	async findHistoryByPurchaseOrder(purchaseOrderId: string) {
		return this.prisma.deliveryOrder.findMany({
			where: {
				purchaseOrderId,
				deletedAt: null,
				typeSalesDelivery: 'RA',
			},
			orderBy: {
				createdAt: 'asc',
			},
			include: {
				au58: true,
				DeliveryOrderDetail: {
					where: {
						deletedAt: null,
					},
					include: {
						PurchaseOrderItem: true,
						MasterBarangJadi: true,
					},
				},
			},
		});
	}

	async update(id: string, updateOrderDeleveryPraDto: UpdateOrderDeleveryPraDto) {
		return this.prisma.$transaction(
			async (tx) => {
				const deliveryOrder = await tx.deliveryOrder.findUniqueOrThrow({
					where: {
						id,
					},
					include: {
						au58: true,
						DeliveryOrderDetail: {
							where: {
								deletedAt: null,
							},
							include: {
								itemsSPB: true,
							},
						},
						purchaseOrder: {
							include: {
								items: true,
							},
						},
					},
				});

				if (deliveryOrder.typeSalesDelivery !== 'RA') {
					throw new Error('Edit Delivery Order hanya diperbolehkan untuk Delivery Order RA');
				}

				if (!deliveryOrder.au58Id) {
					throw new Error('Delivery Order RA tidak memiliki data AU58');
				}

				const au58 = await tx.aU58.update({
					where: {
						id: deliveryOrder.au58Id,
					},
					data: {
						documentNumber: updateOrderDeleveryPraDto.au58Number ?? '',
						au58Date: updateOrderDeleveryPraDto.au58Date ? new Date(updateOrderDeleveryPraDto.au58Date) : null,
					},
				});

				const currentDetails = deliveryOrder.DeliveryOrderDetail;

				if (!currentDetails.length) {
					return {
						deliveryOrderId: deliveryOrder.id,
						au58,
						message: 'Data Delivery Order lama. Hanya AU58 yang diperbarui.',
					};
				}

				const usedBySpb = currentDetails.some((detail) => Array.isArray(detail.itemsSPB) && detail.itemsSPB.length > 0);

				if (usedBySpb) {
					return {
						deliveryOrderId: deliveryOrder.id,
						au58,
						message: 'Delivery Order sudah digunakan pada SPB. Qty Kirim tidak diperbarui.',
					};
				}

				if (!updateOrderDeleveryPraDto.items?.length) {
					throw new Error('Item Delivery Order RA wajib diisi');
				}

				if (updateOrderDeleveryPraDto.items.length !== currentDetails.length) {
					throw new Error('Semua item Delivery Order RA wajib diisi');
				}

				const requestedItemIds = new Set<string>();

				for (const item of updateOrderDeleveryPraDto.items) {
					if (requestedItemIds.has(item.purchaseOrderItemId)) {
						throw new Error(`Purchase Order Item ${item.purchaseOrderItemId} dikirim lebih dari satu kali`);
					}

					requestedItemIds.add(item.purchaseOrderItemId);
				}

				const otherDetails = await tx.deliveryOrderDetail.findMany({
					where: {
						deletedAt: null,
						DeliveryOrder: {
							purchaseOrderId: deliveryOrder.purchaseOrderId,
							deletedAt: null,
							typeSalesDelivery: 'RA',
							id: {
								not: deliveryOrder.id,
							},
						},
					},
					select: {
						purchaseOrderItemId: true,
						qtyKirim: true,
					},
				});

				const qtyFromOtherDO = new Map<string, number>();

				for (const detail of otherDetails) {
					const current = qtyFromOtherDO.get(detail.purchaseOrderItemId) ?? 0;

					qtyFromOtherDO.set(detail.purchaseOrderItemId, current + Number(detail.qtyKirim ?? 0));
				}

				for (const requestedItem of updateOrderDeleveryPraDto.items) {
					const currentDetail = currentDetails.find((detail) => detail.purchaseOrderItemId === requestedItem.purchaseOrderItemId);

					if (!currentDetail) {
						throw new Error(`Item ${requestedItem.purchaseOrderItemId} bukan bagian dari Delivery Order ini`);
					}

					const purchaseOrderItem = deliveryOrder.purchaseOrder.items.find(
						(item) => item.id === requestedItem.purchaseOrderItemId,
					);

					if (!purchaseOrderItem) {
						throw new Error(`Purchase Order Item ${requestedItem.purchaseOrderItemId} tidak ditemukan`);
					}

					const quantityPO = Number(purchaseOrderItem.quantity ?? 0);

					const qtyDOLain = qtyFromOtherDO.get(requestedItem.purchaseOrderItemId) ?? 0;

					const maxQtyKirim = quantityPO - qtyDOLain;

					const qtyKirim = Number(requestedItem.qtyKirim);

					if (qtyKirim <= 0) {
						throw new Error(`Qty kirim ${purchaseOrderItem.namabarangProduct} harus lebih dari 0`);
					}

					if (qtyKirim > maxQtyKirim) {
						throw new Error(`Qty kirim ${purchaseOrderItem.namabarangProduct} melebihi sisa quantity. Maksimal: ${maxQtyKirim}`);
					}

					const priceProduct = Number(currentDetail.unitPrice ?? purchaseOrderItem.priceProduct ?? 0);

					await tx.deliveryOrderDetail.update({
						where: {
							id: currentDetail.id,
						},
						data: {
							qtyKirim,
							total: qtyKirim * priceProduct,
						},
					});
				}

				const updatedDetails = await tx.deliveryOrderDetail.findMany({
					where: {
						deliveryOrderId: deliveryOrder.id,
						deletedAt: null,
					},
					select: {
						qtyKirim: true,
						unitPrice: true,
					},
				});

				const totalAmount = updatedDetails.reduce(
					(total, detail) => total + Number(detail.qtyKirim ?? 0) * Number(detail.unitPrice ?? 0),
					0,
				);

				await tx.deliveryOrder.update({
					where: {
						id: deliveryOrder.id,
					},
					data: {
						totalAmount,
					},
				});

				const allDetails = await tx.deliveryOrderDetail.findMany({
					where: {
						deletedAt: null,
						DeliveryOrder: {
							purchaseOrderId: deliveryOrder.purchaseOrderId,
							deletedAt: null,
							typeSalesDelivery: 'RA',
						},
					},
					select: {
						purchaseOrderItemId: true,
						qtyKirim: true,
					},
				});

				const totalAllocated = new Map<string, number>();

				for (const detail of allDetails) {
					const current = totalAllocated.get(detail.purchaseOrderItemId) ?? 0;

					totalAllocated.set(detail.purchaseOrderItemId, current + Number(detail.qtyKirim ?? 0));
				}

				const isFullyAllocated = deliveryOrder.purchaseOrder.items.every((item) => {
					const allocated = totalAllocated.get(item.id) ?? 0;

					return allocated >= Number(item.quantity ?? 0);
				});

				await tx.purchaseOrder.update({
					where: {
						id: deliveryOrder.purchaseOrderId,
					},
					data: {
						selectionStatus: isFullyAllocated ? 'SELECTED' : 'NOT_SELECTED',
					},
				});

				return {
					deliveryOrderId: deliveryOrder.id,
					au58,
					totalAmount,
					selectionStatus: isFullyAllocated ? 'SELECTED' : 'NOT_SELECTED',
				};
			},
			{
				maxWait: 10000,
				timeout: 15000,
			},
		);
	}

	async remove(id: string) {
		return this.prisma.deliveryOrder.update({
			where: {
				id,
			},
			data: {
				deletedAt: nowWIBString(),
			},
		});
	}

	async restore(id: string) {
		return await this.prisma.deliveryOrder.update({
			where: { id },
			data: { deletedAt: null },
		});
	}
}
