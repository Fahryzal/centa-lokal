import { randomBytes } from 'node:crypto';

export function random16DigitNumber() {
	const buffer = randomBytes(8);
	const randomNumber = BigInt('0x' + buffer.toString('hex'));
	const sixteenDigitNumber = randomNumber % BigInt(10 ** 16);
	return sixteenDigitNumber.toString().padStart(16, '0');
}

export function getRomanMonth(date: Date): string {
	const bulanRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
	return bulanRomawi[date.getMonth()];
}

export function uuID(): string {
	const uuid = crypto.randomUUID();
	return uuid;
}
