import { HttpException, HttpStatus } from '@nestjs/common';
//belum digunakan
export class HttpExceptionBodyMessage extends HttpException {
	constructor(error: any) {
		const status = error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
		const message = error?.response?.data || 'An unknown error occurred';

		super(
			{
				statusCode: status,
				message: message,
			},
			status
		);
	}
}
