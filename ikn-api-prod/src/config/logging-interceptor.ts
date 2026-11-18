import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/modules/common/prisma.service';
import { format, toZonedTime } from 'date-fns-tz';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);
	private readonly timezone = 'Asia/Jakarta'; // WIB timezone
	private readonly maxJsonChars = 30_000;
	private readonly telegramMaxChars = 3500;
	private readonly telegramThrottleMs = 60_000;
	private readonly lastTelegramSentAtByKey = new Map<string, number>();
	private telegramBot?: TelegramBot;

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
	) {}

	private redactForLog(value: unknown, depth = 0): unknown {
		if (depth >= 6) {
			return '[DEPTH_LIMIT]';
		}

		if (value === null || value === undefined) return value;

		if (typeof value === 'function') {
			const fn = value as (...args: unknown[]) => unknown;
			return `[Function${fn.name ? `:${fn.name}` : ''}]`;
		}

		if (typeof value === 'bigint') {
			return value.toString();
		}

		if (Buffer.isBuffer(value)) {
			return { type: 'Buffer', length: value.length };
		}

		if (value instanceof Date) return value.toISOString();
		if (value instanceof Error) {
			return { name: value.name, message: value.message, stack: value.stack };
		}

		if (Array.isArray(value)) {
			const limited = value.slice(0, 50);
			return limited.map((v) => this.redactForLog(v, depth + 1));
		}

		if (typeof value === 'object') {
			const result: Record<string, unknown> = {};
			const record = value as Record<string, unknown>;
			for (const [key, val] of Object.entries(record)) {
				const lowerKey = key.toLowerCase();
				if (
					lowerKey.includes('password') ||
					lowerKey === 'pass' ||
					lowerKey.includes('token') ||
					lowerKey.includes('authorization') ||
					lowerKey.includes('refresh')
				) {
					result[key] = '[REDACTED]';
					continue;
				}
				if (typeof val === 'function') {
					const fn = val as (...args: unknown[]) => unknown;
					result[key] = `[Function${fn.name ? `:${fn.name}` : ''}]`;
					continue;
				}
				if (typeof val === 'bigint') {
					result[key] = val.toString();
					continue;
				}
				result[key] = this.redactForLog(val, depth + 1);
			}
			return result;
		}

		return value;
	}

	private toLogJson(value: unknown): Prisma.InputJsonValue | null {
		if (value === undefined) return null;
		try {
			const redacted = this.redactForLog(value);
			const json = JSON.stringify(redacted);
			if (json.length <= this.maxJsonChars) {
				return redacted as Prisma.InputJsonValue;
			}
			return {
				truncated: true,
				preview: json.slice(0, 2_000),
				originalChars: json.length,
			} as Prisma.InputJsonValue;
		} catch {
			return null;
		}
	}

	private getIp(request: any): string | undefined {
		return (
			request.ip ||
			request.headers?.['x-forwarded-for']?.split?.(',')?.[0]?.trim?.() ||
			request.connection?.remoteAddress ||
			undefined
		);
	}

	private async persistLog(params: {
		status: 'SUCCESS' | 'ERROR';
		action: string;
		actorId?: string;
		actorName: string;
		moduleName?: string;
		method: string;
		url: string;
		httpStatus: number;
		durationMs: number;
		ip?: string;
		userAgent?: string;
		requestBody?: unknown;
		responseBody?: unknown;
		errorDetail?: string;
		errorStack?: string;
		metadata?: unknown;
	}): Promise<string | null> {
		try {
			const created = await this.prisma.serviceLog.create({
				data: {
					status: params.status,
					action: params.action,
					actorId: params.actorId ?? null,
					actorName: params.actorName,
					moduleName: params.moduleName ?? null,
					method: params.method,
					url: params.url,
					httpStatus: params.httpStatus,
					durationMs: params.durationMs,
					ip: params.ip ?? null,
					userAgent: params.userAgent ?? null,
					requestBody: this.toLogJson(params.requestBody),
					responseBody: this.toLogJson(params.responseBody),
					errorDetail: params.errorDetail ?? null,
					errorStack: params.errorStack ?? null,
					metadata: this.toLogJson(params.metadata),
				},
				select: { id: true },
			});
			return created.id;
		} catch (e: any) {
			this.logger.warn(`Failed to persist service log: ${e?.message ?? e}`);
			return null;
		}
	}

	private getSuccessLogEnabled() {
		const value = this.config.get<string>('SERVICE_LOG_SUCCESS_ENABLED');
		if (value === undefined || value === null || value === '') return true;
		const lower = value.toLowerCase();
		if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off' || lower === 'n') return false;
		if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on' || lower === 'y') return true;
		return true;
	}

	private getTelegramConfig() {
		const enabledValue = this.config.get<string>('TELEGRAM_ERROR_NOTIF_ENABLED');
		const enabled =
			enabledValue === 'true' || enabledValue === '1' || enabledValue === 'yes' || enabledValue === 'on' || enabledValue === 'Y';
		const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
		const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
		const notify4xxValue = this.config.get<string>('TELEGRAM_ERROR_NOTIF_4XX');
		const notify4xx =
			notify4xxValue === 'true' ||
			notify4xxValue === '1' ||
			notify4xxValue === 'yes' ||
			notify4xxValue === 'on' ||
			notify4xxValue === 'Y';

		return {
			enabled,
			token,
			chatId,
			notify4xx,
		};
	}

	private buildTelegramMessage(params: {
		timestamp: string;
		httpStatus: number;
		method: string;
		url: string;
		moduleName?: string;
		actorName: string;
		actorId?: string;
		ip?: string;
		errorDetail?: string;
		errorLogId?: string | null;
	}) {
		const env = this.config.get<string>('NODE_ENV') ?? 'unknown';
		const modulePart = params.moduleName ? `\nModule: ${params.moduleName}` : '';
		const actorPart = params.actorId ? `${params.actorName} (${params.actorId})` : params.actorName;
		const ipPart = params.ip ? `\nIP: ${params.ip}` : '';
		const errorLogIdPart = params.errorLogId ? `\nErrorLogId: ${params.errorLogId}` : '';

		const base = [
			`IKN API ERROR (${env})`,
			`Time: ${params.timestamp}`,
			`Status: ${params.httpStatus}`,
			`Action: ${params.method} ${params.url}`,
			`Actor: ${actorPart}`,
			modulePart ? modulePart.trimEnd() : '',
			ipPart ? ipPart.trimEnd() : '',
			errorLogIdPart ? errorLogIdPart.trimEnd() : '',
			params.errorDetail ? `\nError: ${params.errorDetail}` : '',
		]
			.filter(Boolean)
			.join('\n');

		if (base.length <= this.telegramMaxChars) return base;
		return base.slice(0, this.telegramMaxChars) + '…';
	}

	private getTelegramBot() {
		if (this.telegramBot) return this.telegramBot;
		const { token } = this.getTelegramConfig();
		if (!token) return undefined;
		this.telegramBot = new TelegramBot(token, { polling: false });
		return this.telegramBot;
	}

	private async sendTelegramMessage(message: string) {
		const { enabled, token, chatId } = this.getTelegramConfig();
		if (!enabled || !token || !chatId) return;

		const bot = this.getTelegramBot();
		if (!bot) return;
		await bot.sendMessage(chatId, message, { disable_web_page_preview: true });
	}

	private async notifyTelegramError(params: {
		timestamp: string;
		httpStatus: number;
		method: string;
		url: string;
		moduleName?: string;
		actorName: string;
		actorId?: string;
		ip?: string;
		errorDetail?: string;
		errorLogId?: string | null;
	}) {
		const env = this.config.get<string>('NODE_ENV');
		if (env !== 'production' && env !== 'prod') return;

		const { enabled, notify4xx, token, chatId } = this.getTelegramConfig();
		if (!enabled || !token || !chatId) return;
		if (params.httpStatus < 500 && !notify4xx) return;

		const key = `${params.httpStatus}:${params.method}:${params.url}:${params.errorDetail ?? ''}`.slice(0, 200);
		const now = Date.now();
		const last = this.lastTelegramSentAtByKey.get(key) ?? 0;
		if (now - last < this.telegramThrottleMs) return;
		this.lastTelegramSentAtByKey.set(key, now);

		const message = this.buildTelegramMessage(params);
		try {
			await this.sendTelegramMessage(message);
		} catch (e: any) {
			this.logger.warn(`Failed to send Telegram error notification: ${e?.message ?? e}`);
		}
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		const { method, url } = request;
		const startTime = Date.now();

		const formatTimestamp = (date: Date) =>
			format(toZonedTime(date, this.timezone), 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: this.timezone });

		return next.handle().pipe(
			mergeMap((data) => {
				const durationMs = Date.now() - startTime;
				const timestamp = formatTimestamp(new Date());
				const httpStatus = response?.statusCode ?? 200;
				this.logger.log(`SUCCESS [${method}] ${url} - ${durationMs}ms - ${timestamp} (WIB)`);

				if (!this.getSuccessLogEnabled()) return of(data);

				const actorId = request?.user?.id;
				const actorName = request?.user?.name ?? 'anonymous';
				const moduleName = request?.moduleName;

				return from(
					this.persistLog({
						status: 'SUCCESS',
						action: `${method} ${url}`,
						actorId,
						actorName,
						moduleName,
						method,
						url,
						httpStatus,
						durationMs,
						ip: this.getIp(request),
						userAgent: request?.headers?.['user-agent'],
						requestBody: request?.headers?.['content-type']?.includes?.('multipart/form-data') ? undefined : request?.body,
						responseBody: data,
						metadata: {
							query: request?.query,
							params: request?.params,
						},
					}),
				).pipe(mergeMap(() => of(data)));
			}),
			catchError((error) => {
				const durationMs = Date.now() - startTime;
				const timestamp = formatTimestamp(new Date());
				const httpStatus = error instanceof HttpException ? error.getStatus() : 500;
				this.logger.error(`FAILURE [${method}] ${url} - ${httpStatus} - ${durationMs}ms - ${timestamp} (WIB)`, error?.message);

				const actorId = request?.user?.id;
				const actorName = request?.user?.name ?? 'anonymous';
				const moduleName = request?.moduleName;

				const errorResponseBody =
					error instanceof HttpException && typeof error.getResponse === 'function' ? error.getResponse() : undefined;

				return from(
					this.persistLog({
						status: 'ERROR',
						action: `${method} ${url}`,
						actorId,
						actorName,
						moduleName,
						method,
						url,
						httpStatus,
						durationMs,
						ip: this.getIp(request),
						userAgent: request?.headers?.['user-agent'],
						requestBody: request?.headers?.['content-type']?.includes?.('multipart/form-data') ? undefined : request?.body,
						responseBody: errorResponseBody,
						errorDetail: error?.message,
						errorStack: error?.stack,
						metadata: {
							query: request?.query,
							params: request?.params,
						},
					}),
				).pipe(
					mergeMap((errorLogId) =>
						from(
							this.notifyTelegramError({
								timestamp,
								httpStatus,
								method,
								url,
								moduleName,
								actorName,
								actorId,
								ip: this.getIp(request),
								errorDetail: error?.message,
								errorLogId,
							}),
						).pipe(
							catchError(() => of(null)),
							mergeMap(() => throwError(() => error)),
						),
					),
				);
			}),
		);
	}
}
