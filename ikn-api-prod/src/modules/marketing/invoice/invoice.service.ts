import { Injectable, Scope } from '@nestjs/common';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { nowWIBString } from '@src/shared/utils/glolabalFunc';
import dayjs from 'dayjs';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoiceDto } from './dto/get-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable({ scope: Scope.REQUEST })
export class InvoiceService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createInvoiceDto: CreateInvoiceDto) {
		return this.prisma.$transaction(
			async (tx) => {
				const { purchaseOrderId, spbIds, invoiceNumber, invoiceDate, bankAccountId, namaAtasan, jabatanAtasan } =
					createInvoiceDto;

				if (!purchaseOrderId) {
					throw new Error('Purchase Order wajib dipilih');
				}

				if (!spbIds || spbIds.length === 0) {
					throw new Error('Minimal pilih 1 SPB');
				}

				if (!invoiceNumber) {
					throw new Error('Nomor Invoice wajib diisi');
				}

				if (!invoiceDate) {
					throw new Error('Tanggal Invoice wajib diisi');
				}

				const uniqueSpbIds = [...new Set(spbIds)];

				if (uniqueSpbIds.length !== spbIds.length) {
					throw new Error('SPB yang sama tidak boleh dipilih lebih dari satu kali');
				}

				const purchaseOrder = await tx.purchaseOrder.findUnique({
					where: {
						id: purchaseOrderId,
					},
					include: {
						PurchaseOrderTax: {
							where: {
								deletedAt: null,
							},
						},
					},
				});

				if (!purchaseOrder) {
					throw new Error('Purchase Order tidak ditemukan');
				}

				if (purchaseOrder.typePo !== 'RA') {
					throw new Error('Invoice ini hanya dapat dibuat untuk Purchase Order RA');
				}

				const spbs = await tx.sPB.findMany({
					where: {
						id: {
							in: uniqueSpbIds,
						},
						purchaseOrderId,
						deletedAt: null,
						typeSalesSPb: 'RA',
					},
					include: {
						itemsSPB: {
							where: {
								deletedAt: null,
							},
						},
					},
				});

				if (spbs.length !== uniqueSpbIds.length) {
					throw new Error('Ada SPB yang dipilih tetapi tidak ditemukan, bukan RA, atau bukan milik Purchase Order yang dipilih');
				}

				const spbsWithoutItems = spbs.filter((spb) => spb.itemsSPB.length === 0);

				if (spbsWithoutItems.length > 0) {
					throw new Error(`SPB ${spbsWithoutItems.map((spb) => spb.noSpb).join(', ')} belum memiliki item`);
				}

				const existingInvoiceDetails = await tx.invoiceDetail.findMany({
					where: {
						spbId: {
							in: uniqueSpbIds,
						},
						Invoice: {
							deletedAt: null,
						},
					},
					select: {
						spbId: true,
					},
				});

				if (existingInvoiceDetails.length > 0) {
					const alreadyInvoicedSpbIds = [...new Set(existingInvoiceDetails.map((item) => item.spbId))];

					throw new Error(`SPB sudah pernah dibuat Invoice: ${alreadyInvoicedSpbIds.join(', ')}`);
				}

				const purchaseOrderTaxes = purchaseOrder.PurchaseOrderTax;

				if (purchaseOrderTaxes.length === 0) {
					throw new Error('Purchase Order belum memiliki pajak');
				}

				const existingInvoice = await tx.invoice.findFirst({
					where: {
						typeInvoice: 'RA',
						deletedAt: null,
						InvoiceDetail: {
							some: {
								SPB: {
									purchaseOrderId,
									deletedAt: null,
									typeSalesSPb: 'RA',
								},
							},
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
					select: {
						id: true,
						invoiceNumber: true,
						invoiceDate: true,
						masterUnitId: true,
					},
				});

				let invoiceId: string;

				if (!existingInvoice) {
					const invoice = await tx.invoice.create({
						data: {
							spbId: null,
							invoiceNumber,
							invoiceDate: new Date(invoiceDate),
							totalAmount: 0,
							amountTax: 0,
							amountWithTax: 0,
							bankAccountId: bankAccountId ?? null,
							namaAtasan: namaAtasan ?? null,
							jabatanAtasan: jabatanAtasan ?? null,
							typeInvoice: 'RA',
							selectionStatus: 'NOT_SELECTED',
							paymentDate: null,
							masterUnitId: purchaseOrder.unitId,
						},
						select: {
							id: true,
						},
					});

					invoiceId = invoice.id;
				} else {
					invoiceId = existingInvoice.id;
				}

				await tx.invoiceDetail.createMany({
					data: spbs.flatMap((spb) =>
						spb.itemsSPB.map((item) => ({
							id: crypto.randomUUID(),
							invoiceId,
							spbId: spb.id,
							itemsSpbId: item.id,
							quantity: item.qtyKirim ?? 0,
							unitPrice: item.priceProduct,
							total: item.total,
						})),
					),
				});

				await tx.sPB.updateMany({
					where: {
						id: {
							in: uniqueSpbIds,
						},
						typeSalesSPb: 'RA',
						deletedAt: null,
					},
					data: {
						selectionStatus: 'SELECTED',
					},
				});

				const invoiceSpbRelations = await tx.invoiceDetail.findMany({
					where: {
						invoiceId,
						Invoice: {
							deletedAt: null,
							typeInvoice: 'RA',
						},
						deletedAt: null,
					},
					select: {
						spbId: true,
					},
				});

				const invoiceSpbIds = [
					...new Set(invoiceSpbRelations.map((item) => item.spbId).filter((id): id is string => Boolean(id))),
				];

				if (invoiceSpbIds.length === 0) {
					throw new Error('Invoice belum memiliki SPB');
				}

				const invoiceSpbs = await tx.sPB.findMany({
					where: {
						id: {
							in: invoiceSpbIds,
						},
						purchaseOrderId,
						deletedAt: null,
						typeSalesSPb: 'RA',
					},
					include: {
						itemsSPB: {
							where: {
								deletedAt: null,
							},
						},
					},
				});

				if (invoiceSpbs.length !== invoiceSpbIds.length) {
					throw new Error('Ada SPB pada Invoice yang tidak ditemukan atau bukan milik Purchase Order yang sama');
				}

				let subtotalAmount = 0;
				let totalTaxAmount = 0;

				const invoiceTaxMap = new Map<
					string,
					{
						taxId: string;
						taxType: string;
						taxValue: number;
						taxAmount: number;
						accountCode: string | null;
					}
				>();

				for (const spb of invoiceSpbs) {
					const spbSubtotal = Number(spb.subtotalAmount);

					let spbTaxAmount = 0;

					for (const poTax of purchaseOrderTaxes) {
						const taxValue = Number(poTax.taxValue);
						const taxAmount = spbSubtotal * taxValue;

						spbTaxAmount += taxAmount;

						const existingTax = invoiceTaxMap.get(poTax.taxId);

						if (existingTax) {
							existingTax.taxAmount += taxAmount;
						} else {
							invoiceTaxMap.set(poTax.taxId, {
								taxId: poTax.taxId,
								taxType: poTax.taxType,
								taxValue,
								taxAmount,
								accountCode: poTax.accountCode,
							});
						}

						await tx.sPBTax.upsert({
							where: {
								spbId_taxId: {
									spbId: spb.id,
									taxId: poTax.taxId,
								},
							},
							create: {
								spbId: spb.id,
								taxId: poTax.taxId,
								taxType: poTax.taxType,
								taxValue,
								taxAmount,
								accountCode: poTax.accountCode,
							},
							update: {
								taxType: poTax.taxType,
								taxValue,
								taxAmount,
								accountCode: poTax.accountCode,
							},
						});
					}

					const spbTotalAmount = spbSubtotal + spbTaxAmount;

					await tx.sPB.update({
						where: {
							id: spb.id,
						},
						data: {
							taxAmount: spbTaxAmount,
							totalAmount: spbTotalAmount,
							isCekPajak: true,
						},
					});

					subtotalAmount += spbSubtotal;
					totalTaxAmount += spbTaxAmount;
				}

				const invoiceTaxesData = Array.from(invoiceTaxMap.values()).map((tax) => ({
					invoiceId,
					taxId: tax.taxId,
					taxType: tax.taxType,
					taxValue: tax.taxValue,
					taxAmount: tax.taxAmount,
					withheldByCustomer: false,
					isIncludedInPrice: false,
				}));

				await tx.invoiceTax.deleteMany({
					where: {
						invoiceId,
					},
				});

				if (invoiceTaxesData.length > 0) {
					await tx.invoiceTax.createMany({
						data: invoiceTaxesData,
					});
				}

				await tx.invoice.update({
					where: {
						id: invoiceId,
					},
					data: {
						totalAmount: subtotalAmount,
						amountTax: totalTaxAmount,
						amountWithTax: subtotalAmount + totalTaxAmount,
					},
				});

				const remainingSpbs = await tx.sPB.findMany({
					where: {
						purchaseOrderId,
						deletedAt: null,
						typeSalesSPb: 'RA',
						InvoiceDetail: {
							none: {
								Invoice: {
									deletedAt: null,
								},
							},
						},
					},
					select: {
						id: true,
					},
				});

				await tx.purchaseOrder.update({
					where: {
						id: purchaseOrderId,
					},
					data: {
						invoiceSelectionStatus: remainingSpbs.length === 0 ? 'SELECTED' : 'NOT_SELECTED',
					},
				});

				const result = await tx.invoice.findUnique({
					where: {
						id: invoiceId,
					},
					include: {
						InvoiceDetail: true,
						invoiceTaxes: true,
					},
				});

				return result;
			},
			{
				timeout: 15000,
			},
		);
	}

	async getSpbsForInvoice(spbIds: string[]) {
		return this.prisma.sPB.findMany({
			where: {
				id: {
					in: spbIds,
				},
				deletedAt: null,
				typeSalesSPb: 'RA',
			},
			include: {
				itemsSPB: {
					where: {
						deletedAt: null,
					},
				},
			},
		});
	}

	async getNextRaInvoiceNumber() {
		const now = dayjs();
		const month = now.format('MM');
		const year = now.format('YYYY');

		const startOfMonth = now.startOf('month').toDate();
		const endOfMonth = now.endOf('month').toDate();

		const invoices = await this.prisma.invoice.findMany({
			where: {
				typeInvoice: 'RA',
				deletedAt: null,
				invoiceDate: {
					gte: startOfMonth,
					lte: endOfMonth,
				},
				invoiceNumber: {
					startsWith: `INV/RA/${month}/${year}/`,
				},
			},
			select: {
				invoiceNumber: true,
			},
		});

		let nextNumber = 1;

		for (const invoice of invoices) {
			const match = invoice.invoiceNumber.match(new RegExp(`^INV/RA/${month}/${year}/(\\d+)$`));

			if (!match) {
				continue;
			}

			const number = Number(match[1]);

			if (number >= nextNumber) {
				nextNumber = number + 1;
			}
		}

		return `INV/RA/${month}/${year}/${String(nextNumber).padStart(4, '0')}`;
	}

	async getRaInvoiceByPurchaseOrder(purchaseOrderId: string) {
		const invoice = await this.prisma.invoice.findFirst({
			where: {
				typeInvoice: 'RA',
				deletedAt: null,
				InvoiceDetail: {
					some: {
						SPB: {
							purchaseOrderId,
							deletedAt: null,
							typeSalesSPb: 'RA',
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			select: {
				id: true,
				invoiceNumber: true,
				invoiceDate: true,
				bankAccountId: true,
				namaAtasan: true,
				jabatanAtasan: true,
				BankAccount: {
					select: {
						id: true,
						bankName: true,
						bankAccountNumber: true,
					},
				},
			},
		});

		console.log('=== RA INVOICE SERVICE ===');
		console.log(invoice);

		return invoice;
	}

	async findAll(query: GetInvoiceDto, dataToken: DecodeTokenType) {
		const {
			page = 1,
			limit = 10,
			invoiceNumber,
			amount,
			selectionStatusInvoice,
			status,
			orderNumber,
			customerName,
			phone,
			typeInvoice,
			IsNonEkspor,
			date,
			description,
			franco,
			totalAmount,
			amountWithTax,
			invoiceDate,
		} = query;

		const skip = (page - 1) * limit;
		const take = +limit;
		const whereCondition: any = {};

		if (dataToken.isRoot !== 'Y') {
			whereCondition.masterUnitId = dataToken.unitId;
		}

		if (amount) {
			whereCondition.amount = +amount;
		}

		if (dataToken.roles.some((item) => item === 'admin')) {
			whereCondition.staffId = dataToken.id;
		}

		if (invoiceNumber) {
			whereCondition.invoiceNumber = {
				contains: invoiceNumber,
				mode: 'insensitive',
			};
		}

		if (IsNonEkspor) {
			whereCondition.typeInvoice = {
				in: ['RA', 'RN'],
			};
		}

		if (selectionStatusInvoice) {
			whereCondition.selectionStatus = selectionStatusInvoice;
		}

		if (status) {
			whereCondition.status = status;
		}

		if (typeInvoice) {
			whereCondition.typeInvoice = typeInvoice;
		}

		if (totalAmount) {
			whereCondition.totalAmount = +totalAmount;
		}

		if (amountWithTax) {
			whereCondition.amountWithTax = +amountWithTax;
		}

		const purchaseOrderCondition: any = {};

		if (orderNumber) {
			purchaseOrderCondition.orderNumber = {
				contains: orderNumber,
				mode: 'insensitive',
			};
		}

		if (date) {
			purchaseOrderCondition.date = {
				gte: dayjs(date).startOf('day').toDate(),
				lte: dayjs(date).endOf('day').toDate(),
			};
		}

		if (description) {
			purchaseOrderCondition.description = {
				contains: description,
				mode: 'insensitive',
			};
		}

		if (customerName) {
			purchaseOrderCondition.customerName = {
				contains: customerName,
				mode: 'insensitive',
			};
		}

		if (phone) {
			purchaseOrderCondition.customer = {
				phone: {
					contains: phone,
					mode: 'insensitive',
				},
			};
		}

		if (franco) {
			purchaseOrderCondition.franco = {
				contains: franco,
				mode: 'insensitive',
			};
		}

		if (Object.keys(purchaseOrderCondition).length > 0) {
			whereCondition.OR = [
				{
					spb: {
						purchaseOrder: purchaseOrderCondition,
					},
				},
				{
					InvoiceDetail: {
						some: {
							SPB: {
								purchaseOrder: purchaseOrderCondition,
							},
						},
					},
				},
			];
		}

		if (invoiceDate) {
			whereCondition.invoiceDate = {
				gte: dayjs(invoiceDate).startOf('day').toDate(),
				lte: dayjs(invoiceDate).endOf('day').toDate(),
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.invoice.findMany({
				include: {
					invoiceTaxes: true,
					spb: {
						include: {
							itemsSPB: true,
							purchaseOrder: {
								include: {
									customer: true,
									items: true,
								},
							},
						},
					},
					InvoiceDetail: {
						include: {
							SPB: {
								include: {
									itemsSPB: true,
									purchaseOrder: {
										include: {
											customer: true,
											items: true,
										},
									},
								},
							},
							itemsSPB: true,
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
			this.prisma.invoice.count({
				where: whereCondition,
			}),
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
		return this.prisma.invoice.findUnique({
			include: {
				invoiceTaxes: true,
				BankAccount: true,
				spb: {
					include: {
						itemsSPB: true,
						purchaseOrder: {
							include: {
								customer: true,
								items: true,
							},
						},
					},
				},
				InvoiceDetail: {
					include: {
						SPB: {
							include: {
								itemsSPB: true,
								purchaseOrder: {
									include: {
										customer: true,
										items: true,
									},
								},
							},
						},
						itemsSPB: true,
					},
				},
			},
			where: {
				id,
			},
		});
	}

	async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
		const invoice = await this.prisma.invoice.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				typeInvoice: true,
				deletedAt: true,
				InvoiceDetail: {
					select: {
						id: true,
					},
					take: 1,
				},
			},
		});

		if (!invoice) {
			throw new Error('Invoice tidak ditemukan');
		}

		if (invoice.deletedAt) {
			throw new Error('Invoice sudah dihapus');
		}

		// Update hanya boleh untuk Invoice RA
		if (invoice.typeInvoice !== 'RA') {
			throw new Error('Update hanya tersedia untuk Invoice RA');
		}

		const invoiceNumber = updateInvoiceDto.invoiceNumber?.trim();

		if (!invoiceNumber) {
			throw new Error('Nomor Invoice wajib diisi');
		}

		if (!updateInvoiceDto.invoiceDate) {
			throw new Error('Tanggal Invoice wajib diisi');
		}

		const parsedInvoiceDate = new Date(updateInvoiceDto.invoiceDate);

		if (Number.isNaN(parsedInvoiceDate.getTime())) {
			throw new Error('Tanggal Invoice tidak valid');
		}

		await this.prisma.invoice.update({
			where: {
				id,
			},
			data: {
				invoiceNumber,
				invoiceDate: parsedInvoiceDate,

				...(updateInvoiceDto.bankAccountId !== undefined && {
					bankAccountId: updateInvoiceDto.bankAccountId || null,
				}),

				...(updateInvoiceDto.namaAtasan !== undefined && {
					namaAtasan: updateInvoiceDto.namaAtasan?.trim() || null,
				}),

				...(updateInvoiceDto.jabatanAtasan !== undefined && {
					jabatanAtasan: updateInvoiceDto.jabatanAtasan?.trim() || null,
				}),
			},
		});

		return this.findOne(id);
	}

	remove(id: string) {
		const uuid = crypto.randomUUID();

		return this.prisma.invoice.update({
			where: {
				id,
			},
			data: {
				deletedAt: nowWIBString(),
				invoiceNumber: uuid,
			},
		});
	}

	async drop(id: string) {
		return this.prisma.$transaction(
			async (tx) => {
				const invoice = await tx.invoice.findUnique({
					where: {
						id,
					},
					include: {
						InvoiceDetail: {
							select: {
								spbId: true,
							},
						},
					},
				});

				if (!invoice) {
					throw new Error('Invoice tidak ditemukan');
				}

				if (invoice.typeInvoice !== 'RA') {
					throw new Error('Drop hanya tersedia untuk Invoice RA');
				}

				if (invoice.InvoiceDetail.length === 0) {
					throw new Error('Invoice tidak memiliki InvoiceDetail');
				}

				const spbIds = [
					...new Set(invoice.InvoiceDetail.map((detail) => detail.spbId).filter((id): id is string => Boolean(id))),
				];

				const spbs = await tx.sPB.findMany({
					where: {
						id: {
							in: spbIds,
						},
						typeSalesSPb: 'RA',
						deletedAt: null,
					},
					select: {
						id: true,
						purchaseOrderId: true,
						subtotalAmount: true,
					},
				});

				const purchaseOrderIds = [...new Set(spbs.map((spb) => spb.purchaseOrderId))];

				await tx.invoiceTax.deleteMany({
					where: {
						invoiceId: id,
					},
				});

				await tx.invoiceDetail.deleteMany({
					where: {
						invoiceId: id,
					},
				});

				await tx.sPBTax.deleteMany({
					where: {
						spbId: {
							in: spbIds,
						},
					},
				});

				for (const spb of spbs) {
					await tx.sPB.update({
						where: {
							id: spb.id,
						},
						data: {
							selectionStatus: 'NOT_SELECTED',
							taxAmount: 0,
							totalAmount: spb.subtotalAmount,
							isCekPajak: false,
						},
					});
				}

				for (const purchaseOrderId of purchaseOrderIds) {
					const remainingSpbs = await tx.sPB.findMany({
						where: {
							purchaseOrderId,
							deletedAt: null,
							typeSalesSPb: 'RA',
							InvoiceDetail: {
								some: {
									Invoice: {
										deletedAt: null,
									},
								},
							},
						},
						select: {
							id: true,
						},
					});

					await tx.purchaseOrder.update({
						where: {
							id: purchaseOrderId,
						},
						data: {
							invoiceSelectionStatus: remainingSpbs.length === 0 ? 'NOT_SELECTED' : 'SELECTED',
						},
					});
				}

				await tx.invoice.delete({
					where: {
						id,
					},
				});

				return {
					message: 'Invoice RA berhasil di-drop',
				};
			},
			{
				timeout: 15000,
			},
		);
	}
}
