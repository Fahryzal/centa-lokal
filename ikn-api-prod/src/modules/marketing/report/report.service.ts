import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '@src/modules/common/prisma.service';
import dayjs from 'dayjs';
import { GetLaporanPenjualanItemDto } from './dto/get-laporan-penjualan-pra.dto';

@Injectable({ scope: Scope.REQUEST })
export class ReportService {
	constructor(private readonly prisma: PrismaService) {}
	async salesReport(query: GetLaporanPenjualanItemDto) {
		const {
			page = 1,
			limit = 10,
			orderNumber,
			typeSalesSPb,
			startDate,
			endDate,
			tanggalPengiriman,
			noSpb,
			invoiceNumber,
			description,
			franco,
		} = query;

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (orderNumber) {
			whereCondition.orderNumber = {
				contains: orderNumber,
				mode: 'insensitive',
			};
		}

		if (typeSalesSPb) {
			whereCondition.typeSalesSPb = typeSalesSPb;
		}
		if (startDate && endDate) {
			const start = dayjs(startDate).startOf('day').toDate();
			const end = dayjs(endDate).endOf('day').toDate();
			whereCondition.spb = {
				tanggalPengiriman: {
					gte: start,
					lte: end,
				},
			};
		}

		if (tanggalPengiriman) {
			const start = dayjs(tanggalPengiriman).startOf('day').toDate();
			const end = dayjs(tanggalPengiriman).endOf('day').toDate();
			whereCondition.spb = {
				tanggalPengiriman: {
					gte: start,
					lte: end,
				},
			};
		}
		if (noSpb) {
			whereCondition.spb = {
				noSpb: {
					contains: noSpb,
					mode: 'insensitive',
				},
			};
		}
		if (invoiceNumber) {
			whereCondition.spb = {
				invoice: {
					invoiceNumber: {
						contains: invoiceNumber,
						mode: 'insensitive',
					},
				},
			};
		}

		if (description) {
			whereCondition.spb = {
				purchaseOrder: {
					description: {
						contains: description,
						mode: 'insensitive',
					},
				},
			};
		}

		if (franco) {
			whereCondition.spb = {
				purchaseOrder: {
					franco: {
						contains: franco,
						mode: 'insensitive',
					},
				},
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.itemsSPB.findMany({
				skip,
				take,
				where: whereCondition,
				include: {
					spb: {
						include: {
							invoice: true,
							invoiceEkspor: true,
							purchaseOrder: true,
						},
					},
				},
				orderBy: {
					timestamp: 'desc',
				},
			}),
			this.prisma.itemsSPB.count({ where: whereCondition }),
		]);

		return {
			data: data,
			page: +page,
			limit: +limit,
			totalData,
			totalPages: Math.ceil(totalData / +limit),
		};
	}
}
