import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const httpContext = context.switchToHttp();
		const response = httpContext.getResponse(); // Ambil response object

		return next.handle().pipe(
			map((data) => {
				const statusCode = response.statusCode; // Ambil status code
				return {
					success: statusCode >= 200 && statusCode < 300, // True jika sukses
					status: statusCode, // Tambahkan status code ke response
					message: 'Request successfully processed',
					timestamp: new Date().toISOString(),
					data,
				};
			})
		);
	}
}
