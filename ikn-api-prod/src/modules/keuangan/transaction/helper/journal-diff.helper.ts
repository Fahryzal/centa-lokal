// journal-diff.helper.ts

export interface JournalChange {
	field: string;
	label: string; // label human-readable untuk FE
	oldValue: any;
	newValue: any;
}

export function computeJournalDiff(oldEntry: any & { details: any[] }, dto: any, bankAccount: any): JournalChange[] {
	const changes: JournalChange[] = [];

	if (oldEntry.date !== dto.date) {
		changes.push({
			field: 'date',
			label: 'Tanggal Jurnal',
			oldValue: oldEntry.date,
			newValue: dto.date,
		});
	}

	if (oldEntry.totalBalance !== dto.amount) {
		changes.push({
			field: 'totalBalance',
			label: 'Total Nominal',
			oldValue: oldEntry.totalBalance,
			newValue: dto.amount,
		});
	}

	if (oldEntry.referenceNumber !== dto.transactionNumber) {
		changes.push({
			field: 'referenceNumber',
			label: 'Nomor Referensi',
			oldValue: oldEntry.referenceNumber,
			newValue: dto.transactionNumber,
		});
	}

	if (oldEntry.description !== dto.to) {
		changes.push({
			field: 'description',
			label: 'Keterangan',
			oldValue: oldEntry.description,
			newValue: dto.to,
		});
	}

	// Cek perubahan details (nominal per akun)
	const oldDetails = oldEntry.details;
	const newDetails = [
		{
			accountCode: bankAccount.accountCode,
			debit: 0,
			credit: dto.amount,
		},
		...dto.cashBankTransactionDetails.map((d) => ({
			accountCode: d.accountCode,
			debit: d.debit,
			credit: d.credit,
		})),
	];

	oldDetails.forEach((old, index) => {
		const next = newDetails[index];
		if (!next) {
			changes.push({
				field: `details[${index}]`,
				label: `Baris ${index + 1} (${old.accountCode}) dihapus`,
				oldValue: { debit: old.debit, credit: old.credit },
				newValue: null,
			});
			return;
		}

		if (old.debit !== next.debit || old.credit !== next.credit) {
			changes.push({
				field: `details[${index}].amount`,
				label: `Nominal Baris ${index + 1} (${old.accountCode})`,
				oldValue: { debit: old.debit, credit: old.credit },
				newValue: { debit: next.debit, credit: next.credit },
			});
		}
	});

	return changes;
}
