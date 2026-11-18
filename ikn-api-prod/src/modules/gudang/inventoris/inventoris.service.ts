import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { CreateInventorisDto } from './dto/create-inventoris.dto';
import { GetInventorisDto, GetKartuGudangProductDto } from './dto/get-inventoris.dto';
import { UpdateInventorisDto } from './dto/update-inventoris.dto';

@Injectable({ scope: Scope.REQUEST })
export class InventorisService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal,
	) {}

	// penerimaan barang produksi
	async create(createInventorisDto: CreateInventorisDto, staffId: string) {
		// Validasi quantity agar menerima angka desimal
		if (!Array.isArray(createInventorisDto.items) || createInventorisDto.items.length === 0) {
			throw new BadRequestException('Detail penerimaan harus memiliki minimal 1 item.');
		}

		for (const item of createInventorisDto.items) {
			if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
				throw new BadRequestException('Quantity setiap barang harus berupa angka lebih besar dari 0.');
			}

			if (!Number.isFinite(item.nilaiSatuan) || item.nilaiSatuan < 0) {
				throw new BadRequestException('Nilai satuan harus berupa angka yang valid dan tidak negatif.');
			}
		}

		return this.prisma.$transaction(async (prismaTrans) => {
			const receiptItems = createInventorisDto.items.map((item) => ({
				quantity: item.quantity,
				finishedGoodId: item.finishedGoodId,
				Satuan: item.satuan,
				nilaiSatuan: item.nilaiSatuan,
				Total: item.quantity * item.nilaiSatuan,
				stok: 0,
				spesifikasi: item.spesifikasi,
				namaBarang: item.namaBarang,
				kodeBarang: item.kodeBarang,
				kategori: item.kategori,
				unitId: item.unitId,
				createdAt: createInventorisDto.date,
			}));

			await prismaTrans.productionReceipt.create({
				data: {
					documentCode: createInventorisDto.documentCode,
					documentNumber: createInventorisDto.documentNumber,
					date: createInventorisDto.date,
					unitId: createInventorisDto.unitId,
					staffId,
					status: 'DRAFT',
					items: {
						create: receiptItems,
					},
				},
			});
		});
	}

	// posting penerimaan barang jadi
	async post(id: string) {
		return this.prisma.$transaction(
			async (prismaTrans) => {
				const receipt = await prismaTrans.productionReceipt.findUnique({
					where: { id },
					include: {
						items: {
							where: { deletedAt: null },
						},
					},
				});

				if (!receipt) {
					throw new NotFoundException('Penerimaan Barang Jadi tidak ditemukan');
				}

				if (receipt.status !== 'DRAFT') {
					throw new BadRequestException(`Dokumen tidak dapat diposting karena statusnya ${receipt.status ?? 'NULL'}`);
				}

				if (receipt.items.length === 0) {
					throw new BadRequestException('Detail penerimaan Barang Jadi masih kosong');
				}

				// Pastikan dokumen hanya bisa diposting satu kali.
				const claimed = await prismaTrans.productionReceipt.updateMany({
					where: {
						id,
						status: 'DRAFT',
					},
					data: {
						status: 'POSTING',
					},
				});

				if (claimed.count !== 1) {
					throw new BadRequestException('Dokumen sudah diproses atau telah diposting');
				}

				// Catat stok masuk berdasarkan detail yang sudah tersimpan.
				await prismaTrans.inventoryTransaction.createMany({
					data: receipt.items.map((item) => ({
						source: 'produksi/persediaan',
						sourceId: receipt.id,
						quantity: item.quantity,
						transactionType: 'IN',
						productId: item.finishedGoodId,
						satuan: item.Satuan,
						nilaiSatuan: item.nilaiSatuan,
						unitId: item.unitId,
						createdAt: receipt.date,
						transactionDate: receipt.date,
					})),
				});

				// Hitung stok aktual setelah transaksi IN dibuat.
				for (const item of receipt.items) {
					const [stokMasuk, stokKeluar] = await Promise.all([
						prismaTrans.inventoryTransaction.aggregate({
							_sum: {
								quantity: true,
							},
							where: {
								productId: item.finishedGoodId,
								transactionType: 'IN',
								unitId: item.unitId,
								deletedAt: null,
							},
						}),
						prismaTrans.inventoryTransaction.aggregate({
							_sum: {
								quantity: true,
							},
							where: {
								productId: item.finishedGoodId,
								transactionType: 'OUT',
								unitId: item.unitId,
								deletedAt: null,
							},
						}),
					]);

					const stokTerkini = Number(stokMasuk._sum.quantity ?? 0) - Number(stokKeluar._sum.quantity ?? 0);

					await prismaTrans.productionReceiptItem.update({
						where: {
							id: item.id,
						},
						data: {
							stok: stokTerkini,
						},
					});
				}

				// Selesaikan posting.
				return prismaTrans.productionReceipt.update({
					where: { id },
					data: {
						status: 'POSTED',
					},
					include: {
						unit: true,
						items: {
							include: {
								unit: true,
								finishedGood: true,
							},
						},
					},
				});
			},
			{
				maxWait: 10000,
				timeout: 15000,
			},
		);
	}

	// revert posting penerimaan barang jadi
	async revert(id: string) {
		return this.prisma.$transaction(
			async (prismaTrans) => {
				const receipt = await prismaTrans.productionReceipt.findUnique({
					where: { id },
					include: {
						items: {
							where: { deletedAt: null },
						},
					},
				});

				if (!receipt) {
					throw new NotFoundException('Penerimaan Barang Jadi tidak ditemukan');
				}

				if (receipt.status !== 'POSTED') {
					throw new BadRequestException(
						`Dokumen hanya dapat di-revert jika status POSTED. Status saat ini: ${receipt.status ?? 'NULL'}`,
					);
				}

				if (receipt.items.length === 0) {
					throw new BadRequestException('Detail penerimaan Barang Jadi tidak ditemukan');
				}

				// Kelompokkan quantity detail berdasarkan barang dan unit.
				const expectedByProduct = new Map<string, number>();

				for (const item of receipt.items) {
					const key = `${item.finishedGoodId}:${item.unitId}`;

					expectedByProduct.set(key, (expectedByProduct.get(key) ?? 0) + Number(item.quantity));
				}

				// Ambil seluruh transaksi IN dan OUT pembalik milik dokumen ini.
				// Transaksi OUT dari Revert sebelumnya mengurangi dampak IN lama.
				const history = await prismaTrans.inventoryTransaction.findMany({
					where: {
						sourceId: receipt.id,
						source: {
							in: ['produksi/persediaan', 'revert penerimaan barang jadi'],
						},
						deletedAt: null,
					},
				});

				// Hitung dampak stok bersih dokumen per barang dan unit.
				const netByProduct = new Map<string, number>();

				for (const tx of history) {
					const key = `${tx.productId}:${tx.unitId}`;
					const sign = tx.transactionType === 'IN' ? 1 : tx.transactionType === 'OUT' ? -1 : 0;

					const currentQuantity = netByProduct.get(key) ?? 0;
					const transactionQuantity = Number(tx.quantity);

					netByProduct.set(key, currentQuantity + sign * transactionQuantity);
				}

				// Pastikan dampak Posting yang masih tersisa sesuai detail terbaru.
				for (const [key, expectedQty] of expectedByProduct) {
					const actualQty = netByProduct.get(key) ?? 0;

					if (Math.abs(actualQty - expectedQty) > 0.000001) {
						throw new BadRequestException(
							`Saldo transaksi aktif tidak sesuai dengan detail penerimaan untuk barang ${key}. Saldo transaksi: ${actualQty}, detail: ${expectedQty}. Revert dibatalkan.`,
						);
					}
				}

				// Pastikan tidak ada saldo transaksi aktif tambahan untuk barang
				// yang tercatat pada riwayat dokumen tetapi tidak ada di detail.
				for (const [key, actualQty] of netByProduct) {
					const expectedQty = expectedByProduct.get(key) ?? 0;

					if (Math.abs(actualQty - expectedQty) > 0.000001) {
						throw new BadRequestException(
							`Saldo transaksi aktif tidak sesuai dengan detail penerimaan untuk barang ${key}. Revert dibatalkan.`,
						);
					}
				}

				// Periksa stok global terkini sebelum membuat transaksi OUT.
				for (const [key, quantity] of expectedByProduct) {
					const separatorIndex = key.lastIndexOf(':');
					const productId = key.substring(0, separatorIndex);
					const unitId = key.substring(separatorIndex + 1);

					const [stokMasuk, stokKeluar] = await Promise.all([
						prismaTrans.inventoryTransaction.aggregate({
							_sum: { quantity: true },
							where: {
								productId,
								unitId,
								transactionType: 'IN',
								deletedAt: null,
							},
						}),
						prismaTrans.inventoryTransaction.aggregate({
							_sum: { quantity: true },
							where: {
								productId,
								unitId,
								transactionType: 'OUT',
								deletedAt: null,
							},
						}),
					]);

					const stokTerkini = Number(stokMasuk._sum.quantity ?? 0) - Number(stokKeluar._sum.quantity ?? 0);

					if (stokTerkini + 0.000001 < quantity) {
						throw new BadRequestException(
							`Stok barang ${productId} tidak cukup untuk Revert. Stok saat ini: ${stokTerkini}, jumlah yang dibatalkan: ${quantity}.`,
						);
					}
				}

				// Buat transaksi OUT berdasarkan detail Posting yang sedang aktif,
				// bukan berdasarkan seluruh transaksi IN historis.
				await prismaTrans.inventoryTransaction.createMany({
					data: receipt.items.map((item) => ({
						source: 'revert penerimaan barang jadi',
						sourceId: receipt.id,
						quantity: item.quantity,
						transactionType: 'OUT',
						productId: item.finishedGoodId,
						satuan: item.Satuan,
						nilaiSatuan: item.nilaiSatuan,
						unitId: item.unitId,
						createdAt: new Date(),
						transactionDate: new Date(),
					})),
				});

				// Hitung ulang stok global setelah transaksi pembalik dibuat.
				for (const item of receipt.items) {
					const [stokMasuk, stokKeluar] = await Promise.all([
						prismaTrans.inventoryTransaction.aggregate({
							_sum: { quantity: true },
							where: {
								productId: item.finishedGoodId,
								unitId: item.unitId,
								transactionType: 'IN',
								deletedAt: null,
							},
						}),
						prismaTrans.inventoryTransaction.aggregate({
							_sum: { quantity: true },
							where: {
								productId: item.finishedGoodId,
								unitId: item.unitId,
								transactionType: 'OUT',
								deletedAt: null,
							},
						}),
					]);

					await prismaTrans.productionReceiptItem.update({
						where: { id: item.id },
						data: {
							stok: Number(stokMasuk._sum.quantity ?? 0) - Number(stokKeluar._sum.quantity ?? 0),
						},
					});
				}

				// Kembalikan dokumen menjadi DRAFT setelah Revert berhasil.
				return prismaTrans.productionReceipt.update({
					where: { id },
					data: { status: 'DRAFT' },
					include: {
						unit: true,
						items: {
							include: {
								unit: true,
								finishedGood: true,
							},
						},
					},
				});
			},
			{
				maxWait: 10000,
				timeout: 15000,
			},
		);
	}

	async findAll(query: GetInventorisDto, decoded: DecodeTokenType) {
		const { page = 1, limit = 10, sortBy, sortOrder, date, documentCode, documentNumber, unit } = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {};

		if (!(decoded.isRoot === 'Y' || decoded.isPusat)) {
			whereCondition.unitId = decoded.unitId;
		}

		// Jika parameter `unit` ada, tambahkan filter `unit`
		if (documentCode) {
			whereCondition.documentCode = {
				contains: documentCode,
				mode: 'insensitive',
			};
		}

		if (documentNumber) {
			whereCondition.documentNumber = {
				contains: documentNumber,
				mode: 'insensitive',
			};
		}

		if (unit) {
			whereCondition.unit = {
				nama: {
					contains: unit,
					mode: 'insensitive',
				},
			};
		}

		if (date) {
			const startDate = new Date(date); // langsung pakai
			const endDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000 - 1);

			whereCondition.date = {
				gte: startDate,
				lte: endDate,
			};
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.productionReceipt.findMany({
				skip,
				take,
				include: {
					unit: true,
				},
				where: whereCondition,
				orderBy: orderBy ?? { createdAt: 'desc' }, // fallback default
			}),
			this.prisma.productionReceipt.count({ where: whereCondition }),
		]);

		return {
			data,
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	async findOneProduct(productId: string, query: GetKartuGudangProductDto) {
		const { page = 1, limit = 10, sortBy, sortOrder, year } = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder); // sortField = "kategori.nama", sortOrder = "asc"

		const skip = (page - 1) * limit;
		const take = +limit;
		const [data, totalData, dataProduct] = await this.prisma.$transaction([
			this.prisma.inventoryTransaction.findMany({
				skip,
				take,
				orderBy: orderBy ?? { createdAt: 'asc' }, // fallback default
				include: {
					unit: true,
				},
				where: {
					productId,
					transactionDate: {
						gte: new Date(`${year}-01-01T00:00:00.000Z`),
						lt: new Date(`${year}-12-31T00:00:00.000Z`),
					},
				},
			}),
			this.prisma.inventoryTransaction.count({
				where: {
					productId,
					transactionDate: {
						gte: new Date(`${year}-01-01T00:00:00.000Z`),
						lt: new Date(`${year}-12-31T00:00:00.000Z`),
					},
				},
			}),

			this.prisma.masterBarangJadi.findUnique({
				where: {
					id: productId,
				},
			}),
		]);

		const result = [];
		let currentStock = 0;
		for (const tx of data) {
			const stokAwal = currentStock;
			const qty = tx.quantity;
			const type = tx.transactionType;

			// Hitung stok akhir
			if (type === 'IN') {
				currentStock += qty;
			} else if (type === 'OUT') {
				currentStock -= qty;
			}

			result.push({
				...tx,
				stokAwal,
				stokAkhir: currentStock,
			});
		}
		return {
			data: {
				...dataProduct,
				result,
			},
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	findOne(id: string) {
		return this.prisma.productionReceipt.findUnique({
			include: {
				unit: true,
				items: {
					include: {
						unit: true,
						finishedGood: true,
					},
				},
			},
			where: {
				id,
			},
		});
	}

	// Hapus penerimaan barang jadi yang berstatus DRAFT
	async remove(id: string) {
		const receipt = await this.prisma.productionReceipt.findFirst({
			where: {
				id,
				deletedAt: null,
			},
			include: {
				items: {
					where: {
						deletedAt: null,
					},
				},
			},
		});

		if (!receipt) {
			throw new NotFoundException('Data penerimaan barang jadi tidak ditemukan');
		}

		// Dokumen yang masih POSTED tidak boleh dihapus
		if (receipt.status !== 'DRAFT') {
			throw new BadRequestException('Dokumen harus di-revert terlebih dahulu sebelum dihapus');
		}

		const sources = ['produksi/persediaan', 'revert penerimaan barang jadi'];

		// Ambil transaksi aktif berdasarkan sourceId dokumen
		const inventoryTransactions = await this.prisma.inventoryTransaction.findMany({
			where: {
				sourceId: receipt.id,
				source: {
					in: sources,
				},
				deletedAt: null,
			},
		});

		// Pastikan efek stok dari dokumen sudah netral
		const netStock = new Map<string, number>();

		for (const transaction of inventoryTransactions) {
			const key = `${transaction.productId}-${transaction.unitId}`;
			const current = netStock.get(key) ?? 0;

			if (transaction.transactionType === 'IN') {
				netStock.set(key, current + transaction.quantity);
			} else if (transaction.transactionType === 'OUT') {
				netStock.set(key, current - transaction.quantity);
			}
		}

		const hasRemainingStock = [...netStock.values()].some((quantity) => quantity !== 0);

		if (hasRemainingStock) {
			throw new BadRequestException(
				'Dokumen tidak dapat dihapus karena transaksi stok belum seimbang. Lakukan revert terlebih dahulu.',
			);
		}

		// Hapus transaksi dan dokumen dalam satu database transaction
		await this.prisma.$transaction(
			async (tx) => {
				// Hapus semua transaksi inventory berdasarkan sourceId
				await tx.inventoryTransaction.deleteMany({
					where: {
						sourceId: receipt.id,
						source: {
							in: sources,
						},
					},
				});

				// Hapus detail penerimaan barang
				await tx.productionReceiptItem.deleteMany({
					where: {
						receiptId: receipt.id,
					},
				});

				// Hapus header penerimaan barang
				await tx.productionReceipt.delete({
					where: {
						id: receipt.id,
					},
				});
			},
			{
				maxWait: 10000,
				timeout: 15000,
			},
		);

		return {
			message: 'Data penerimaan barang jadi dan transaksi inventory berhasil dihapus',
		};
	}

	// update penerimaan barang jadi yang belum diposting
	async update(id: string, updateInventorisDto: UpdateInventorisDto) {
		return this.prisma.$transaction(async (prismaTrans) => {
			const receipt = await prismaTrans.productionReceipt.findUnique({
				where: { id },
				include: {
					items: true,
				},
			});

			if (!receipt) {
				throw new NotFoundException('Penerimaan Barang Jadi tidak ditemukan');
			}

			if (receipt.status !== 'DRAFT') {
				throw new BadRequestException(
					`Dokumen hanya dapat diedit jika status DRAFT. Status saat ini: ${receipt.status ?? 'NULL'}.`,
				);
			}

			// Jangan mengedit jika dokumen sudah memiliki riwayat stok.
			// Ini mencegah detail berubah sementara transaksi stok lama
			// masih mengacu pada dokumen yang sama.

			const { documentCode, documentNumber, date, unitId, items } = updateInventorisDto;

			// Validasi kuantitas agar menerima angka desimal.
			if (items !== undefined) {
				if (!Array.isArray(items) || items.length === 0) {
					throw new BadRequestException('Detail penerimaan harus memiliki minimal 1 item.');
				}

				for (const item of items) {
					if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
						throw new BadRequestException('Quantity setiap barang harus berupa angka lebih besar dari 0.');
					}

					if (!Number.isFinite(item.nilaiSatuan) || item.nilaiSatuan < 0) {
						throw new BadRequestException('Nilai satuan harus berupa angka yang valid dan tidak negatif.');
					}
				}

				// Jangan menghapus detail yang terkait dengan produksi.
				if (receipt.items.some((item) => item.productionIssueId !== null)) {
					throw new BadRequestException(
						'Detail penerimaan terhubung dengan transaksi produksi dan tidak dapat diganti melalui Edit ini.',
					);
				}
			}

			// Perbarui header. Field yang tidak dikirim tidak berubah.
			await prismaTrans.productionReceipt.update({
				where: { id },
				data: {
					...(documentCode !== undefined && { documentCode }),
					...(documentNumber !== undefined && {
						documentNumber,
					}),
					...(date !== undefined && { date }),
					...(unitId !== undefined && { unitId }),
				},
			});

			// Jika items dikirim, ganti seluruh detail dengan detail baru.
			// Jika items tidak dikirim, detail lama tetap dipertahankan.
			if (items !== undefined) {
				await prismaTrans.productionReceiptItem.deleteMany({
					where: {
						receiptId: receipt.id,
					},
				});

				await prismaTrans.productionReceiptItem.createMany({
					data: items.map((item) => ({
						receiptId: receipt.id,
						quantity: item.quantity,
						finishedGoodId: item.finishedGoodId,
						Satuan: item.satuan,
						nilaiSatuan: item.nilaiSatuan,
						Total: item.quantity * item.nilaiSatuan,
						stok: 0,
						spesifikasi: item.spesifikasi,
						namaBarang: item.namaBarang,
						kodeBarang: item.kodeBarang,
						kategori: item.kategori,
						unitId: item.unitId,
						createdAt: date ?? receipt.date,
					})),
				});
			}

			// Status tetap DRAFT. Tidak ada transaksi stok yang dibuat.
			return prismaTrans.productionReceipt.findUnique({
				where: { id },
				include: {
					unit: true,
					items: {
						include: {
							unit: true,
							finishedGood: true,
						},
					},
				},
			});
		});
	}
}
