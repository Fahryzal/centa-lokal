import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Menghasilkan objek Date dengan timezone Asia/Jakarta (WIB)
 */
export const nowWIB = (): Date => {
	return dayjs().tz('Asia/Jakarta').toDate();
};

/**
 * Format string ISO dengan timezone Asia/Jakarta
 */
export const nowWIBString = (): Date => {
	// return dayjs().tz('Asia/Jakarta').format(); // menghasilkan ISO +07:00
	const now = new Date();
	// konversi UTC ke WIB (UTC+7)
	const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
	return wib;
};

/**
 * Convert date apa pun ke WIB
 */
export const toWIB = (date: string | Date): Date => {
	return dayjs(date).tz('Asia/Jakarta').toDate();
};

export const getYearWIB = () => {
	return dayjs().tz('Asia/Jakarta').year();
};
