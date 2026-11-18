import { Controller, Get, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SetModuleName } from '@shared/guards/module-name.guard';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import { ApiTags } from '@nestjs/swagger';

@Controller({ version: '1' })
@SetModuleName('downlaod-log')
@ApiTags('Log')
export class LogsController {
	@Get()
	async downloadLogs(@Res() res: Response) {
		const logDir = path.join(process.cwd(), 'log');

		// Cek apakah direktori log ada
		if (!fs.existsSync(logDir)) {
			throw new HttpException('Log directory not found', HttpStatus.NOT_FOUND);
		}

		// Buat stream response dan tetapkan header untuk file zip
		res.setHeader('Content-Type', 'application/zip');
		res.setHeader('Content-Disposition', 'attachment; filename=logs.zip');

		// Buat objek archiver
		const archive = archiver('zip', { zlib: { level: 9 } });

		// Handle error archiving
		archive.on('error', (err) => {
			throw new HttpException(`Archive error: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
		});

		// Pipe data dari archiver ke response
		archive.pipe(res);

		// Tambahkan semua file log dari direktori log ke archive
		fs.readdirSync(logDir).forEach((file) => {
			if (file.endsWith('.log')) {
				const filePath = path.join(logDir, file);
				archive.file(filePath, { name: file });
			}
		});

		// Akhiri archive dan kirim response
		await archive.finalize();
	}
}
