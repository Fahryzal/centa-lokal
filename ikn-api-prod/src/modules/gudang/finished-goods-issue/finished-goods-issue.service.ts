import { BadRequestException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';
import { PrismaService } from '@src/modules/common/prisma.service';
import { CreateFinishedGoodsIssueDto } from './dto/create-finished-goods-issue.dto';
import { UpdateFinishedGoodsIssueDto } from './dto/update-finished-goods-issue.dto';

@Injectable({ scope: Scope.REQUEST })
export class FinishedGoodsIssueService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly helperGlobal: HelperGlobal,
	) {}

	// CREATE pengeluaran barang jadi
	async create(createFinishedGoodsIssueDto: CreateFinishedGoodsIssueDto, staffId: string) {
		const { items, unitId, date } = createFinishedGoodsIssueDto;

		// 1. Validasi daftar detail barang
		if (!Array.isArray(items) || items.length === 0) {
			throw new BadRequestException('Detail pengeluaran harus memiliki minimal 1 item.');
		}

		// 2. Validasi quantity setiap barang
		for (const item of items) {
			if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
				throw new BadRequestException('Quantity setiap barang harus berupa angka lebih besar dari 0.');
			}

			if (!item.finishedGoodId) {
				throw new BadRequestException('Barang jadi harus dipilih.');
			}

			if (!item.Satuan || !item.Satuan.trim()) {
				throw new BadRequestException('Satuan barang tidak boleh kosong.');
			}
		}

		// 3. Mulai transaksi database
		return this.prisma.$transaction(
			async (prismaTrans) => {
				// 4. Validasi unit
				const unit = await prismaTrans.masterUnit.findFirst({
					where: {
						id: unitId,
						deletedAt: null,
					},
				});

				if (!unit) {
					throw new NotFoundException('Unit pengeluaran barang jadi tidak ditemukan.');
				}

				// 5. Ambil seluruh ID barang yang dipilih
				const finishedGoodIds = [...new Set(items.map((item) => item.finishedGoodId))];

				// 6. Ambil data barang dari MasterBarangJadi
				const finishedGoods = await prismaTrans.masterBarangJadi.findMany({
					where: {
						id: {
							in: finishedGoodIds,
						},
						deletedAt: null,
					},
					select: {
						id: true,
						nilaiSatuan: true,
					},
				});

				// 7. Pastikan seluruh barang ditemukan
				if (finishedGoods.length !== finishedGoodIds.length) {
					throw new NotFoundException('Terdapat barang jadi yang tidak ditemukan atau sudah dihapus.');
				}

				// 8. Buat mapping nilaiSatuan dari master barang
				const finishedGoodMap = new Map(finishedGoods.map((finishedGood) => [finishedGood.id, finishedGood]));

				// 9. Buat header dokumen ProductionIssue
				const issue = await prismaTrans.productionIssue.create({
					data: {
						documentCode: createFinishedGoodsIssueDto.documentCode,
						documentNumber: createFinishedGoodsIssueDto.documentNumber,
						date,
						unitId,
						staffId,
						status: 'DRAFT',
						diPergunakan: createFinishedGoodsIssueDto.diPergunakan,
						keterangan: createFinishedGoodsIssueDto.keterangan,
					},
				});

				// 10. Siapkan detail ProductionIssueItem
				const issueItems = items.map((item) => {
					const finishedGood = finishedGoodMap.get(item.finishedGoodId);

					if (!finishedGood) {
						throw new NotFoundException(`Barang jadi dengan ID ${item.finishedGoodId} tidak ditemukan.`);
					}

					return {
						issueId: issue.id,
						finishedGoodId: item.finishedGoodId,
						quantity: item.quantity,
						Satuan: item.Satuan,
						nilaiSatuan: finishedGood.nilaiSatuan,
					};
				});

				// 11. Simpan seluruh detail barang
				await prismaTrans.productionIssueItem.createMany({
					data: issueItems,
				});

				// 12. Ambil kembali dokumen beserta detailnya
				return prismaTrans.productionIssue.findUnique({
					where: {
						id: issue.id,
					},
					include: {
						unit: true,
						ProductionIssueItem: {
							where: {
								deletedAt: null,
							},
							include: {
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

	// GET ALL pengeluaran barang jadi
	async findAll(query: any, decoded: DecodeTokenType) {
		const { page = 1, limit = 10, sortBy, sortOrder, date, documentCode, documentNumber, unit, status } = query;

		const orderBy = this.helperGlobal.buildOrderBy(sortBy, sortOrder);

		const skip = (page - 1) * limit;
		const take = +limit;

		const whereCondition: any = {
			deletedAt: null,
		};

		// Batasi data berdasarkan hak akses unit
		if (!(decoded.isRoot === 'Y' || decoded.isPusat)) {
			whereCondition.unitId = decoded.unitId;
		}

		// Filter nomor kode dokumen
		if (documentCode) {
			whereCondition.documentCode = {
				contains: documentCode,
				mode: 'insensitive',
			};
		}

		// Filter nomor dokumen
		if (documentNumber) {
			whereCondition.documentNumber = {
				contains: documentNumber,
				mode: 'insensitive',
			};
		}

		// Filter berdasarkan nama unit
		if (unit) {
			whereCondition.unit = {
				nama: {
					contains: unit,
					mode: 'insensitive',
				},
			};
		}

		// Filter tanggal
		if (date) {
			const startDate = new Date(date);
			const endDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000 - 1);

			whereCondition.date = {
				gte: startDate,
				lte: endDate,
			};
		}

		// Filter status dokumen
		if (status) {
			whereCondition.status = status;
		}

		const [data, totalData] = await this.prisma.$transaction([
			this.prisma.productionIssue.findMany({
				skip,
				take,
				include: {
					unit: true,
					ProductionIssueItem: {
						where: {
							deletedAt: null,
						},
						include: {
							finishedGood: true,
						},
					},
				},
				where: whereCondition,
				orderBy: orderBy ?? { createdAt: 'desc' },
			}),

			this.prisma.productionIssue.count({
				where: whereCondition,
			}),
		]);

		return {
			data,
			totalData,
			page: +page,
			limit: +limit,
			totalPages: Math.ceil(totalData / +limit),
		};
	}

	// GET DETAIL pengeluaran barang jadi berdasarkan ID
	async findOne(id: string, decoded: DecodeTokenType) {
		const whereCondition: any = {
			id,
			deletedAt: null,
		};

		if (!(decoded.isRoot === 'Y' || decoded.isPusat)) {
			whereCondition.unitId = decoded.unitId;
		}

		const data = await this.prisma.productionIssue.findFirst({
			where: whereCondition,
			include: {
				unit: true,
				ProductionIssueItem: {
					where: {
						deletedAt: null,
					},
					include: {
						finishedGood: true,
					},
				},
			},
		});

		if (!data) {
			throw new NotFoundException('Data pengeluaran barang jadi tidak ditemukan.');
		}

		return data;
	}

	// POST pengeluaran barang jadi
	async post(id: string, decoded: DecodeTokenType) {
		return this.prisma.$transaction(
			async (prismaTrans) => {
				// 1. Cari dokumen beserta detail barang
				const issue = await prismaTrans.productionIssue.findFirst({
					where: {
						id,
						deletedAt: null,
						...(decoded.isRoot === 'Y' || decoded.isPusat ? {} : { unitId: decoded.unitId }),
					},
					include: {
						ProductionIssueItem: {
							where: {
								deletedAt: null,
							},
						},
					},
				});

				// 2. Pastikan dokumen ditemukan
				if (!issue) {
					throw new NotFoundException('Data pengeluaran barang jadi tidak ditemukan.');
				}

				// 3. Pastikan status dokumen DRAFT atau REVERTED
				if (!['DRAFT', 'REVERTED'].includes(issue.status)) {
					throw new BadRequestException('Pengeluaran barang jadi hanya dapat diposting jika berstatus DRAFT atau REVERTED.');
				}

				// 4. Pastikan detail barang tersedia
				if (!issue.ProductionIssueItem || issue.ProductionIssueItem.length === 0) {
					throw new BadRequestException('Detail pengeluaran barang jadi tidak ditemukan.');
				}

				// 5. Validasi setiap detail barang
				for (const item of issue.ProductionIssueItem) {
					if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
						throw new BadRequestException('Quantity pengeluaran harus berupa angka lebih besar dari 0.');
					}

					if (!item.finishedGoodId) {
						throw new BadRequestException('Barang jadi pada detail pengeluaran tidak valid.');
					}

					if (!item.Satuan || !item.Satuan.trim()) {
						throw new BadRequestException('Satuan barang tidak boleh kosong.');
					}
				}

				// 6. Buat transaksi inventori OUT untuk setiap detail
				await prismaTrans.inventoryTransaction.createMany({
					data: issue.ProductionIssueItem.map((item) => ({
						productId: item.finishedGoodId,
						transactionType: 'OUT',
						quantity: item.quantity,
						unitId: issue.unitId,
						satuan: item.Satuan,
						nilaiSatuan: item.nilaiSatuan,
						source: 'pengeluaran barang jadi',
						sourceId: issue.id,
						transactionDate: issue.date,
					})),
				});

				// 7. Ubah status dokumen menjadi POSTED
				const updatedIssue = await prismaTrans.productionIssue.update({
					where: {
						id: issue.id,
					},
					data: {
						status: 'POSTED',
					},
					include: {
						unit: true,
						ProductionIssueItem: {
							where: {
								deletedAt: null,
							},
							include: {
								finishedGood: true,
							},
						},
					},
				});

				return updatedIssue;
			},
			{
				maxWait: 10000,
				timeout: 15000,
			},
		);
	}

	// REVERT pengeluaran barang jadi
	async revert(id: string, decoded: DecodeTokenType) {
		return this.prisma.$transaction(
			async (prismaTrans) => {
				// 1. Cari dokumen pengeluaran beserta detailnya
				const issue = await prismaTrans.productionIssue.findFirst({
					where: {
						id,
						deletedAt: null,
						...(decoded.isRoot === 'Y' || decoded.isPusat ? {} : { unitId: decoded.unitId }),
					},
					include: {
						ProductionIssueItem: {
							where: {
								deletedAt: null,
							},
						},
					},
				});

				// 2. Pastikan dokumen ditemukan
				if (!issue) {
					throw new NotFoundException('Data pengeluaran barang jadi tidak ditemukan.');
				}

				// 3. Pastikan status dokumen POSTED
				if (issue.status !== 'POSTED') {
					throw new BadRequestException('Pengeluaran barang jadi hanya dapat direvert jika berstatus POSTED.');
				}

				// 4. Cari seluruh transaksi OUT dari dokumen ini
				const transactionsOut = await prismaTrans.inventoryTransaction.findMany({
					where: {
						sourceId: issue.id,
						source: 'pengeluaran barang jadi',
						transactionType: 'OUT',
						deletedAt: null,
						revertedAt: null,
					},
				});

				// 5. Pastikan transaksi OUT tersedia
				if (transactionsOut.length === 0) {
					throw new BadRequestException('Transaksi pengeluaran barang jadi tidak ditemukan.');
				}

				// 6. Buat transaksi IN sebagai pengembalian seluruh stok
				await prismaTrans.inventoryTransaction.createMany({
					data: transactionsOut.map((item) => ({
						productId: item.productId,
						transactionType: 'IN',
						source: 'revert pengeluaran barang jadi',
						sourceId: issue.id,
						quantity: item.quantity,
						unitId: item.unitId,
						satuan: item.satuan,
						nilaiSatuan: item.nilaiSatuan,
						transactionDate: new Date(),
					})),
				});

				await prismaTrans.inventoryTransaction.updateMany({
					where: {
						id: {
							in: transactionsOut.map((item) => item.id),
						},
					},
					data: {
						revertedAt: new Date(),
					},
				});

				// 7. Ubah status dokumen menjadi REVERTED
				const updatedIssue = await prismaTrans.productionIssue.update({
					where: {
						id: issue.id,
					},
					data: {
						status: 'REVERTED',
					},
					include: {
						unit: true,
						ProductionIssueItem: {
							where: {
								deletedAt: null,
							},
							include: {
								finishedGood: true,
							},
						},
					},
				});

				return updatedIssue;
			},
			{
				maxWait: 10000,
				timeout: 15000,
			},
		);
	}

	async update(id: string, updateDto: UpdateFinishedGoodsIssueDto, decoded: DecodeTokenType) {
		return this.prisma.$transaction(
			async (prismaTrans) => {
				// 1. Cari dokumen berdasarkan ID dan hak akses unit
				const issue = await prismaTrans.productionIssue.findFirst({
					where: {
						id,
						deletedAt: null,
						...(decoded.isRoot === 'Y' || decoded.isPusat ? {} : { unitId: decoded.unitId }),
					},
				});

				// 2. Pastikan dokumen ditemukan
				if (!issue) {
					throw new NotFoundException('Data pengeluaran barang jadi tidak ditemukan.');
				}

				// 3. Pastikan status DRAFT atau REVERTED
				if (!['DRAFT', 'REVERTED'].includes(issue.status)) {
					throw new BadRequestException(
						'Pengeluaran barang jadi hanya dapat diubah jika berstatus DRAFT atau REVERTED. Silakan revert terlebih dahulu.',
					);
				}

				// 4. Tentukan unit yang akan digunakan
				const unitId = updateDto.unitId ?? issue.unitId;

				// 5. Validasi unit
				const unit = await prismaTrans.masterUnit.findFirst({
					where: {
						id: unitId,
						deletedAt: null,
					},
				});

				if (!unit) {
					throw new NotFoundException('Unit pengeluaran barang jadi tidak ditemukan.');
				}

				// 6. Validasi hak akses unit
				if (!(decoded.isRoot === 'Y' || decoded.isPusat) && unitId !== decoded.unitId) {
					throw new BadRequestException('Anda tidak memiliki akses untuk mengubah unit pengeluaran barang jadi.');
				}

				// 7. Validasi kode dokumen agar tidak digunakan dokumen lain
				if (updateDto.documentCode !== undefined) {
					const existingDocument = await prismaTrans.productionIssue.findFirst({
						where: {
							documentCode: updateDto.documentCode,
							id: { not: issue.id },
							deletedAt: null,
						},
					});

					if (existingDocument) {
						throw new BadRequestException('Kode dokumen sudah digunakan.');
					}
				}

				// 8. Validasi dan siapkan detail barang jika items dikirim
				let issueItems: {
					issueId: string;
					finishedGoodId: string;
					quantity: number;
					Satuan: string;
					nilaiSatuan: number;
				}[] = [];

				if (updateDto.items !== undefined) {
					if (!Array.isArray(updateDto.items) || updateDto.items.length === 0) {
						throw new BadRequestException('Detail pengeluaran harus memiliki minimal 1 item.');
					}

					// Validasi setiap item
					for (const item of updateDto.items) {
						if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
							throw new BadRequestException('Quantity setiap barang harus berupa angka lebih besar dari 0.');
						}

						if (!item.finishedGoodId) {
							throw new BadRequestException('Barang jadi harus dipilih.');
						}

						if (!item.Satuan || !item.Satuan.trim()) {
							throw new BadRequestException('Satuan barang tidak boleh kosong.');
						}
					}

					// Cegah barang yang sama dimasukkan lebih dari satu kali
					const finishedGoodIds = updateDto.items.map((item) => item.finishedGoodId);

					if (new Set(finishedGoodIds).size !== finishedGoodIds.length) {
						throw new BadRequestException('Barang yang sama tidak boleh dimasukkan lebih dari satu kali.');
					}

					// Ambil master barang jadi
					const finishedGoods = await prismaTrans.masterBarangJadi.findMany({
						where: {
							id: {
								in: finishedGoodIds,
							},
							deletedAt: null,
						},
						select: {
							id: true,
							nilaiSatuan: true,
						},
					});

					// Pastikan seluruh master barang ditemukan
					if (finishedGoods.length !== finishedGoodIds.length) {
						throw new NotFoundException('Terdapat barang jadi yang tidak ditemukan atau sudah dihapus.');
					}

					// Mapping nilaiSatuan berdasarkan finishedGoodId
					const finishedGoodMap = new Map(finishedGoods.map((item) => [item.id, item]));

					// Siapkan seluruh detail baru
					issueItems = updateDto.items.map((item) => {
						const finishedGood = finishedGoodMap.get(item.finishedGoodId);

						if (!finishedGood) {
							throw new NotFoundException(`Barang jadi dengan ID ${item.finishedGoodId} tidak ditemukan.`);
						}

						return {
							issueId: issue.id,
							finishedGoodId: item.finishedGoodId,
							quantity: item.quantity,
							Satuan: item.Satuan,
							nilaiSatuan: finishedGood.nilaiSatuan,
						};
					});
				}

				// 9. UPDATE header ProductionIssue
				await prismaTrans.productionIssue.update({
					where: {
						id: issue.id,
					},
					data: {
						...(updateDto.documentCode !== undefined && {
							documentCode: updateDto.documentCode,
						}),
						...(updateDto.documentNumber !== undefined && {
							documentNumber: updateDto.documentNumber,
						}),
						...(updateDto.date !== undefined && {
							date: updateDto.date,
						}),
						...(updateDto.unitId !== undefined && {
							unitId: updateDto.unitId,
						}),
						...(updateDto.diPergunakan !== undefined && {
							diPergunakan: updateDto.diPergunakan,
						}),
						...(updateDto.keterangan !== undefined && {
							keterangan: updateDto.keterangan,
						}),
						status: 'DRAFT',
					},
				});

				// 10. Hapus dan buat ulang seluruh detail ProductionIssueItem
				if (updateDto.items !== undefined) {
					// A. Hapus permanen seluruh detail lama berdasarkan issueId
					await prismaTrans.productionIssueItem.deleteMany({
						where: {
							issueId: issue.id,
						},
					});

					// B. Masukkan kembali seluruh detail dari frontend
					await prismaTrans.productionIssueItem.createMany({
						data: issueItems,
					});
				}

				// 11. Ambil kembali dokumen terbaru
				return prismaTrans.productionIssue.findUnique({
					where: {
						id: issue.id,
					},
					include: {
						unit: true,
						ProductionIssueItem: {
							where: {
								deletedAt: null,
							},
							include: {
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

	// DELETE pengeluaran barang jadi (HARD DELETE)
	async remove(id: string, decoded: DecodeTokenType) {
		return this.prisma.$transaction(
			async (prismaTrans) => {
				// 1. Cari dokumen berdasarkan ID dan hak akses unit
				const issue = await prismaTrans.productionIssue.findFirst({
					where: {
						id,
						deletedAt: null,
						...(decoded.isRoot === 'Y' || decoded.isPusat ? {} : { unitId: decoded.unitId }),
					},
				});

				// 2. Pastikan dokumen ditemukan
				if (!issue) {
					throw new NotFoundException('Data pengeluaran barang jadi tidak ditemukan.');
				}

				// 3. Hapus seluruh inventory transaction berdasarkan sourceId
				await prismaTrans.inventoryTransaction.deleteMany({
					where: {
						sourceId: issue.id,
					},
				});

				// 4. Hapus seluruh detail ProductionIssueItem berdasarkan issueId
				await prismaTrans.productionIssueItem.deleteMany({
					where: {
						issueId: issue.id,
					},
				});

				// 5. Hapus header ProductionIssue berdasarkan ID
				const deletedIssue = await prismaTrans.productionIssue.delete({
					where: {
						id: issue.id,
					},
				});

				return {
					message: 'Data pengeluaran barang jadi berhasil dihapus.',
					data: deletedIssue,
				};
			},
			{
				maxWait: 10000,
				timeout: 15000,
			},
		);
	}
}
