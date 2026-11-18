import { Injectable } from '@nestjs/common';
import { CreateInvoiceEksporDto } from './dto/create-invoice-ekspor.dto';
// import { UpdateInvoiceEksporDto } from './dto/update-invoice-ekspor.dto';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
import { GetInvoiceEksporDto } from './dto/get-invoice-ekspor.dto';
import { UpdateInvoiceEksporDto } from './dto/update-invoice-ekspor.dto';

@Injectable()
export class InvoiceEksporService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal,
	) {}
	async create(createInvoiceEksporDto: CreateInvoiceEksporDto, dataUser: DecodeTokenType) {
		const {
			invoiceNumber,
			proformaNumber,
			date,
			purchaseOrder,
			customerId,
			additionalCharges,
			totalCIF,
			currency,
			incoterms,
			description,
			typePayment,
			downPayment,
			fileUrl,
			spbId,
		} = createInvoiceEksporDto;

		// Create InvoiceEkspor along with related entities
		return await this.prisma.$transaction(async (tx) => {
			await tx.invoiceEkspor.create({
				data: {
					invoiceNumber,
					proformaNumber,
					date: dayjs(date) as any,
					purchaseOrder,
					totalCIF,
					currency,
					incoterms: incoterms,
					description,
					typePayment,
					downPayment,
					MasterUnit: {
						connect: { id: dataUser.unitId },
					},
					spb: {
						connect: { id: spbId },
					},
					fileUrl,
					staff: {
						connect: { id: dataUser.id },
					},
					customer: {
						connect: { id: customerId },
					},
					costSummary: {
						create: additionalCharges?.map((item) => ({
							amount: item.amount,
							description: item.description,
							type: item.type,
						})), // Assuming costSummary is structured correctly
					},
				},
			});

			await tx.sPB.update({
				where: {
					id: spbId,
				},
				data: {
					selectionStatus: 'SELECTED',
				},
			});
		});
	}

	async findAll(query: GetInvoiceEksporDto) {
		const {
			page = 1,
			limit = 100,
			customerName,
			date,
			incoterms,
			invoiceNumber,
			paymentDate,
			status,
			sortBy,
			sortOrder,
			proformaNumber,
			purchaseOrder,
			totalCIF,
			typePayment,
			description,
		} = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const skip = (page - 1) * limit;
		const take = +limit;
		let whereCondition: any = {};

		if (invoiceNumber) {
			whereCondition.invoiceNumber = {
				contains: invoiceNumber,
				mode: 'insensitive',
			};
		}

		if (proformaNumber) {
			whereCondition.proformaNumber = {
				contains: proformaNumber,
				mode: 'insensitive',
			};
		}

		if (purchaseOrder) {
			whereCondition.purchaseOrder = {
				contains: purchaseOrder,
				mode: 'insensitive',
			};
		}

		if (status) {
			whereCondition.status = status;
		}

		if (typePayment) {
			whereCondition.typePayment = typePayment;
		}

		if (totalCIF) {
			whereCondition.totalCIF = +totalCIF;
		}

		if (date) {
			const start = dayjs(date).startOf('day').toDate();
			const end = dayjs(date).endOf('day').toDate();

			whereCondition.date = {
				gte: start,
				lte: end,
			};
		}

		if (paymentDate) {
			whereCondition.paymentDate = paymentDate;
		}

		if (incoterms) {
			whereCondition.incoterms = incoterms;
		}
		if (customerName) {
			whereCondition = {
				...whereCondition,
				customer: {
					name: {
						contains: customerName,
						mode: 'insensitive',
					},
				},
			};
		}

		if (description) {
			whereCondition.description = {
				contains: description,
				mode: 'insensitive',
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.invoiceEkspor.findMany({
				skip,
				take,
				where: whereCondition,
				include: {
					customer: true,
				},
				orderBy: orderBy ?? { invoiceNumber: 'asc' }, // fallback default
			}),
			this.prisma.invoiceEkspor.count({ where: whereCondition }),
		]);

		return {
			data,
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: string) {
		return this.prisma.invoiceEkspor.findUnique({
			where: { id },
			include: {
				customer: true,
				costSummary: true,
			},
		});
	}

	async update(id: string, updateInvoiceEksporDto: UpdateInvoiceEksporDto, dataUser) {
		const {
			invoiceNumber,
			proformaNumber,
			date,
			purchaseOrder,
			customerId,
			additionalCharges,
			totalCIF,
			currency,
			incoterms,
			description,
			typePayment,
			downPayment,
			fileUrl,
		} = updateInvoiceEksporDto;

		return await this.prisma.$transaction(async (tx) => {
			// Hapus semua costSummary lama
			await tx.costSummary.deleteMany({
				where: { invoiceId: id },
			});

			// Update InvoiceEkspor + buat costSummary baru
			const updatedInvoice = await tx.invoiceEkspor.update({
				where: { id },
				data: {
					invoiceNumber,
					proformaNumber,
					date: dayjs(date) as any,
					purchaseOrder,
					totalCIF,
					currency,
					incoterms,
					description,
					typePayment,
					downPayment,
					fileUrl,
					MasterUnit: {
						connect: { id: dataUser.unitId },
					},
					staff: {
						connect: { id: dataUser.id },
					},
					customer: {
						connect: { id: customerId },
					},
					costSummary: {
						create: additionalCharges?.map((item) => ({
							amount: item.amount,
							description: item.description,
							type: item.type,
						})),
					},
				},
				include: {
					costSummary: true,
				},
			});

			return updatedInvoice;
		});
	}

	remove(id: string) {
		return this.prisma.invoiceEkspor.delete({ where: { id } });
	}
}
