import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetModuleName } from '@shared/guards/module-name.guard';
import { Request } from 'express';
import { FrontendErrorService } from './frontend-error.service';

@Controller({ version: '1', path: 'frontend-error' })
@SetModuleName('frontend-error')
@ApiTags('FrontendError')
export class FrontendErrorController {
	constructor(private readonly frontendErrorService: FrontendErrorService) {}

	@Post()
	@ApiOperation({ summary: 'Report FE error' })
	report(@Body() body: any, @Req() req: Request) {
		const ip =
			(req as any)?.ip ||
			(req as any)?.headers?.['x-forwarded-for']?.toString?.()?.split?.(',')?.[0]?.trim?.() ||
			(req as any)?.socket?.remoteAddress;

		const userAgent = (req as any)?.headers?.['user-agent'];
		const clientToken = (req as any)?.headers?.['x-client-log-token']?.toString?.();

		return this.frontendErrorService.reportError({
			payload: body,
			ip,
			userAgent,
			clientToken,
		});
	}
}
