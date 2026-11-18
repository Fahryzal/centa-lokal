import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from '@src/modules/common/prisma.service';
import { HelperGlobal } from '@src/common/utils/helper/helper';
import { NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DecodeTokenType } from '@src/modules/auth/authentikasi/authentikasi.controller';

// 1. Mock Data
const mockDecodedToken: DecodeTokenType = {
	id: 'user-123',
	username: 'testuser',
	role: 'ADMIN',
	// Add other properties if necessary based on the type definition
} as any;

const mockCreateTransactionDto: CreateTransactionDto = {
	bank_account_id: 'bank-123',
	invoiceId: 'invoice-123',
	amount: 1000000,
	jumlahBayar: 1000000,
	transactionNumber: 'TRX-001',
	date: new Date(),
	description: 'Test Transaction',
	cashBankTransactionDetails: [],
	unitId: 'unit-1',
	currency: 'RP',
	// Add other properties if necessary based on the DTO
} as any;

const mockCreateTransactionDollarDto: CreateTransactionDto = {
	...mockCreateTransactionDto,
	invoiceId: 'invoice-ekspor-123',
	jumlahBayarDollar: 100,
	amountOriginal: 100,
	currency: 'USD',
	exchangeRate: 15000,
} as any;

// 2. Mock Prisma Client (Transaction Client)
const mockPrismaTransactionClient = {
	invoice: {
		findUnique: jest.fn(),
		update: jest.fn(),
		aggregate: jest.fn(),
	},
	invoiceEkspor: {
		findUnique: jest.fn(),
		update: jest.fn(),
		aggregate: jest.fn(),
	},
	purchaseOrder: {
		update: jest.fn(),
	},
	bankAccount: {
		update: jest.fn(),
	},
	journalEntry: {
		count: jest.fn(),
		create: jest.fn(),
	},
	cashBankTransaction: {
		create: jest.fn(),
	},
	accountMapping: {
		findMany: jest.fn(),
	},
};

// 3. Mock Prisma Service Utama
const mockPrismaService = {
	bankAccount: {
		findUnique: jest.fn(),
	},
	account: {
		findFirst: jest.fn(),
	},
	journalEntry: {
		count: jest.fn(),
	},
	accountMapping: {
		findMany: jest.fn(),
	},
	// KEY: Mock $transaction to execute callback with mock client
	$transaction: jest.fn().mockImplementation(async (callback) => {
		return callback(mockPrismaTransactionClient);
	}),
};

const mockHelperGlobal = {
	generateJournalEntriesFromMappingV3: jest.fn(),
};

describe('TransactionService', () => {
	let service: TransactionService;
	let prisma: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TransactionService,
				{
					provide: PrismaService,
					useValue: mockPrismaService,
				},
				{
					provide: HelperGlobal,
					useValue: mockHelperGlobal,
				},
			],
		}).compile();

		service = await module.resolve<TransactionService>(TransactionService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should throw NotFoundException if bank account not found', async () => {
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue(null);

			await expect(service.create(mockCreateTransactionDto, mockDecodedToken)).rejects.toThrow(NotFoundException);
		});

		it('should throw NotFoundException if income account not found', async () => {
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue({
				id: 'bank-123',
				accountCode: '1111',
				unitId: 'unit-1',
				currentBalance: 5000000,
			});
			(prisma.account.findFirst as jest.Mock).mockResolvedValue(null);

			await expect(service.create(mockCreateTransactionDto, mockDecodedToken)).rejects.toThrow(NotFoundException);
		});

		it('should throw Error if invoice not found inside transaction', async () => {
			// Setup dependencies outside transaction
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue({
				id: 'bank-123',
				accountCode: '1111',
				unitId: 'unit-1',
				currentBalance: 5000000,
			});
			(prisma.account.findFirst as jest.Mock).mockResolvedValue({
				id: 'acc-1',
				code: '1111',
			});

			// Setup dependencies inside transaction
			mockPrismaTransactionClient.invoice.findUnique.mockResolvedValue(null);

			await expect(service.create(mockCreateTransactionDto, mockDecodedToken)).rejects.toThrow('Invoice tidak ditemukan');
		});

		it('should successfully create a transaction', async () => {
			// 1. Mock dependencies outside transaction
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue({
				id: 'bank-123',
				accountCode: '1111',
				unitId: 'unit-1',
				currentBalance: 5000000,
			});
			(prisma.account.findFirst as jest.Mock).mockResolvedValue({
				id: 'acc-1',
				code: '1111',
			});

			// 2. Mock dependencies inside transaction
			mockPrismaTransactionClient.invoice.findUnique.mockResolvedValue({
				id: 'invoice-123',
				amountWithTax: 2000000,
				downPayment: 0,
				totalAmount: 2000000,
				typeInvoice: 'RA',
				spb: { purchaseOrderId: 'po-123' },
				invoiceTaxes: [],
			});
			// Mock main prisma service calls
			(prisma.journalEntry.count as jest.Mock).mockResolvedValue(10);
			(prisma.accountMapping.findMany as jest.Mock).mockResolvedValue([{ accountCode: '9999', position: 'DEBIT' }]);

			mockPrismaTransactionClient.journalEntry.count.mockResolvedValue(10);
			mockPrismaTransactionClient.accountMapping.findMany.mockResolvedValue([{ accountCode: '9999', position: 'DEBIT' }]);
			mockPrismaTransactionClient.cashBankTransaction.create.mockResolvedValue({
				id: 'trx-new-id',
				transactionNumber: mockCreateTransactionDto.transactionNumber,
			});
			mockPrismaTransactionClient.journalEntry.create.mockResolvedValue({
				id: 'journal-entry-id',
			});

			// 3. Execute
			const result = await service.create(mockCreateTransactionDto, mockDecodedToken);

			// 4. Assert
			expect(prisma.$transaction).toHaveBeenCalled();
			expect(mockPrismaTransactionClient.invoice.update).toHaveBeenCalled();
			expect(mockPrismaTransactionClient.cashBankTransaction.create).toHaveBeenCalled();
			expect(result).toEqual(
				expect.objectContaining({
					id: 'trx-new-id',
				})
			);
		});
	});

	describe('createDollar', () => {
		it('should throw NotFoundException if bank account not found', async () => {
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue(null);

			await expect(service.createDollar(mockCreateTransactionDollarDto, mockDecodedToken)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should throw NotFoundException if income account not found', async () => {
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue({
				id: 'bank-123',
				accountCode: '1111',
				unitId: 'unit-1',
				currentBalance: 5000000,
			});
			(prisma.account.findFirst as jest.Mock).mockResolvedValue(null);

			await expect(service.createDollar(mockCreateTransactionDollarDto, mockDecodedToken)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should throw Error if invoice not found inside transaction', async () => {
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue({
				id: 'bank-123',
				accountCode: '1111',
				unitId: 'unit-1',
				currentBalance: 5000000,
			});
			(prisma.account.findFirst as jest.Mock).mockResolvedValue({
				id: 'acc-1',
				code: '1111',
			});

			mockPrismaTransactionClient.invoiceEkspor.findUnique.mockResolvedValue(null);

			await expect(service.createDollar(mockCreateTransactionDollarDto, mockDecodedToken)).rejects.toThrow(
				'Invoice tidak ditemukan'
			);
		});

		it('should successfully create a dollar transaction', async () => {
			// 1. Mock dependencies outside transaction
			(prisma.bankAccount.findUnique as jest.Mock).mockResolvedValue({
				id: 'bank-123',
				accountCode: '1111',
				unitId: 'unit-1',
				currentBalance: 5000000,
			});
			(prisma.account.findFirst as jest.Mock).mockResolvedValue({
				id: 'acc-1',
				code: '1111',
			});

			// 2. Mock dependencies inside transaction
			mockPrismaTransactionClient.invoiceEkspor.findUnique.mockResolvedValue({
				id: 'invoice-ekspor-123',
				totalCIF: 200,
				donePayment: 0,
				purchaseOrder: 'po-ekspor-123',
				masterUnitId: 'unit-1',
			});

			// Mock main prisma service calls
			(prisma.journalEntry.count as jest.Mock).mockResolvedValue(10);
			(prisma.accountMapping.findMany as jest.Mock).mockResolvedValue([{ accountCode: '9999', position: 'DEBIT' }]);

			mockPrismaTransactionClient.journalEntry.count.mockResolvedValue(10);
			mockPrismaTransactionClient.accountMapping.findMany.mockResolvedValue([{ accountCode: '9999', position: 'DEBIT' }]);
			mockPrismaTransactionClient.cashBankTransaction.create.mockResolvedValue({
				id: 'trx-dollar-new-id',
				transactionNumber: mockCreateTransactionDollarDto.transactionNumber,
			});
			mockPrismaTransactionClient.journalEntry.create.mockResolvedValue({
				id: 'journal-entry-id',
			});

			// 3. Execute
			const result = await service.createDollar(mockCreateTransactionDollarDto, mockDecodedToken);

			// 4. Assert
			expect(prisma.$transaction).toHaveBeenCalled();
			expect(mockPrismaTransactionClient.invoiceEkspor.update).toHaveBeenCalled();
			expect(mockPrismaTransactionClient.cashBankTransaction.create).toHaveBeenCalled();
			expect(result).toEqual(
				expect.objectContaining({
					id: 'trx-dollar-new-id',
				})
			);
		});
	});
});
