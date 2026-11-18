import { CanActivate, Injectable, NestMiddleware } from '@nestjs/common';
import { CustomLoggerService } from '@src/common/utils/logger/logger.service';
import { NextFunction } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingMiddleware implements NestMiddleware, CanActivate {
	constructor(private readonly logger: CustomLoggerService) {}

	canActivate(context: any): boolean | Promise<boolean> | Observable<boolean> {
		context.moduleName = 'Logging' as any;
		return true;
	}

	decodeToken(token: string) {
		// Memecah token menjadi bagian-bagian
		const parts = token.split('.');
		if (parts.length !== 3) {
			return false;
		}
		// Mengambil payload (bagian kedua)
		const payload = parts[1];
		// Mengganti karakter yang tidak valid untuk Base64
		const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
		// Decode dari Base64
		const decoded = Buffer.from(base64, 'base64').toString('utf8');
		return JSON.parse(decoded); // Mengembalikan objek JSON
	}
	use(req: any, res: any, next: NextFunction) {
		const { method, originalUrl, body, headers } = req;
		this.canActivate(req);
		let username = 'anonymous';
		if (headers.authorization) {
			const jwtDecoded = this.decodeToken(headers.authorization);
			username = jwtDecoded ? jwtDecoded.name : 'anonymous';
		}
		const requestBody = JSON.stringify(body);
		// Mengatur nama file log berdasarkan username dan tanggal
		this.logger.setLoggerFile(username);

		const oldWrite = res.write;
		const oldEnd = res.end;
		const chunks: any[] = [];

		res.write = (...restArgs: any[]) => {
			chunks.push(Buffer.from(restArgs[0]));
			oldWrite.apply(res, restArgs);
		};
		res.end = (...restArgs: any[]) => {
			if (restArgs[0]) {
				chunks.push(Buffer.from(restArgs[0]));
			}
			const responseBody = Buffer.concat(chunks).toString('utf8');
			const now = new Date();
			const date = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
			const time = now.toTimeString().split(' ')[0].replace(/:/g, '.'); // Format HH.mm

			const logMessage = `
				Timestamp: ${date} ${time},)},
				Username: ${username},
				Method: ${method},
				URL: ${originalUrl},
				Request Body: ${requestBody},
				Response Body: ${responseBody}`;
			this.logger.log(logMessage); // Log ke file dengan nama sesuai username dan tanggal
			oldEnd.apply(res, restArgs);
		};
		next();
	}
}
