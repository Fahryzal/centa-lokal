import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLoggerService implements LoggerService {
	private logger: winston.Logger;

	setLoggerFile(username: string) {
		const date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
		const logDir = 'log';
		const filename = `${username}-${date}.log`; // Nama file dengan username dan tanggal

		// Buat direktori log jika belum ada
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}

		const logFilePath = path.join(logDir, filename);

		this.logger = winston.createLogger({
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ timestamp, level, message }) => {
					return `${timestamp} ${level}: ${message}\n`; // Menambahkan baris baru setelah setiap log
				})
			),
			transports: [
				new winston.transports.File({
					filename: logFilePath, // Atur nama file secara manual
					maxsize: 20000000, // Ukuran maksimal per file (20MB)
					maxFiles: 14, // Simpan maksimal 14 file log
				}),
			],
		});
	}

	log(message: string) {
		this.logger.info(message);
	}

	error(message: string) {
		this.logger.error(message);
	}

	warn(message: string) {
		this.logger.warn(message);
	}
}
