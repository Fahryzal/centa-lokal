import { PrismaService } from '@modules/common/prisma.service';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import TelegramBot = require('node-telegram-bot-api');

type FrontendErrorPayload = {
	message: string;
	stack?: string;
	pageUrl?: string;
	route?: string;
	componentStack?: string;
	userAgent?: string;
	release?: string;
	source?: string;
	actorId?: string;
	actorName?: string;
	metadata?: unknown;
};

@Injectable()
export class FrontendErrorService {
	private readonly logger = new Logger(FrontendErrorService.name);
	private readonly maxJsonChars = 30_000;
	private readonly telegramMaxChars = 3500;
	private readonly telegramThrottleMs = 60_000;
	private readonly lastTelegramSentAtByKey = new Map<string, number>();
	private telegramBot?: TelegramBot;

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
	) {}

	private sanitizeForJson(value: unknown, depth = 0): unknown {
		if (depth >= 6) return '[DEPTH_LIMIT]';
		if (value === null || value === undefined) return value;

		if (typeof value === 'function') {
			const fn = value as (...args: unknown[]) => unknown;
			return `[Function${fn.name ? `:${fn.name}` : ''}]`;
		}
		if (typeof value === 'bigint') return value.toString();
		if (Buffer.isBuffer(value)) return { type: 'Buffer', length: value.length };
		if (value instanceof Date) return value.toISOString();
		if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack };

		if (Array.isArray(value)) return value.slice(0, 50).map((v) => this.sanitizeForJson(v, depth + 1));

		if (typeof value === 'object') {
			const result: Record<string, unknown> = {};
			for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
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
				result[key] = this.sanitizeForJson(val, depth + 1);
			}
			return result;
		}

		return value;
	}

	private toLogJson(value: unknown): Prisma.InputJsonValue | null {
		if (value === undefined) return null;
		try {
			const sanitized = this.sanitizeForJson(value);
			const json = JSON.stringify(sanitized);
			if (json.length <= this.maxJsonChars) return sanitized as Prisma.InputJsonValue;
			return {
				truncated: true,
				preview: json.slice(0, 2_000),
				originalChars: json.length,
			} as Prisma.InputJsonValue;
		} catch {
			return null;
		}
	}

	private getTelegramConfig() {
		const enabledValue = this.config.get<string>('TELEGRAM_ERROR_NOTIF_ENABLED');
		const enabled =
			enabledValue === 'true' || enabledValue === '1' || enabledValue === 'yes' || enabledValue === 'on' || enabledValue === 'Y';
		const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
		const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');
		return { enabled, token, chatId };
	}

	private getTelegramBot() {
		if (this.telegramBot) return this.telegramBot;
		const { token } = this.getTelegramConfig();
		if (!token) return undefined;
		this.telegramBot = new TelegramBot(token, { polling: false });
		return this.telegramBot;
	}

	private buildTelegramMessage(params: { timestamp: string; errorLogId: string; payload: FrontendErrorPayload }) {
		const env = this.config.get<string>('NODE_ENV') ?? 'unknown';
		const actorPart = params.payload.actorId
			? `${params.payload.actorName ?? 'anonymous'} (${params.payload.actorId})`
			: (params.payload.actorName ?? 'anonymous');
		const location = params.payload.route ?? params.payload.pageUrl ?? 'unknown';
		const releasePart = params.payload.release ? `\nRelease: ${params.payload.release}` : '';
		const sourcePart = params.payload.source ? `\nSource: ${params.payload.source}` : '';

		const base = [
			`IKN FE ERROR (${env})`,
			`Time: ${params.timestamp}`,
			`ErrorLogId: ${params.errorLogId}`,
			`Actor: ${actorPart}`,
			`Location: ${location}`,
			releasePart ? releasePart.trimEnd() : '',
			sourcePart ? sourcePart.trimEnd() : '',
			params.payload.message ? `\nError: ${params.payload.message}` : '',
		]
			.filter(Boolean)
			.join('\n');

		if (base.length <= this.telegramMaxChars) return base;
		return base.slice(0, this.telegramMaxChars) + '…';
	}

	private async sendTelegramMessage(message: string) {
		const { enabled, token, chatId } = this.getTelegramConfig();
		if (!enabled || !token || !chatId) return;
		const bot = this.getTelegramBot();
		if (!bot) return;
		await bot.sendMessage(chatId, message, { disable_web_page_preview: true });
	}

	private async maybeNotifyTelegram(params: { timestamp: string; errorLogId: string; payload: FrontendErrorPayload }) {
		const { enabled, token, chatId } = this.getTelegramConfig();
		if (!enabled || !token || !chatId) return;
		const key = `${params.payload.message ?? ''}:${params.payload.route ?? ''}:${params.payload.pageUrl ?? ''}`.slice(0, 200);
		const now = Date.now();
		const last = this.lastTelegramSentAtByKey.get(key) ?? 0;
		if (now - last < this.telegramThrottleMs) return;
		this.lastTelegramSentAtByKey.set(key, now);

		try {
			await this.sendTelegramMessage(this.buildTelegramMessage(params));
		} catch (e: any) {
			this.logger.warn(`Failed to send Telegram FE error notification: ${e?.message ?? e}`);
		}
	}

	private assertTokenIfConfigured(providedToken?: string) {
		const expected = this.config.get<string>('CLIENT_ERROR_LOG_TOKEN');
		if (!expected) return;
		if (!providedToken || providedToken !== expected) {
			throw new ForbiddenException('Invalid client log token');
		}
	}

	async reportError(params: {
		payload: FrontendErrorPayload;
		ip?: string;
		userAgent?: string;
		clientToken?: string;
	}): Promise<{ id: string }> {
		this.assertTokenIfConfigured(params.clientToken);

		const created = await this.prisma.serviceLog.create({
			data: {
				status: 'ERROR',
				action: 'FE_ERROR',
				actorId: params.payload.actorId ?? null,
				actorName: params.payload.actorName ?? 'anonymous',
				moduleName: 'frontend',
				method: 'FE',
				url: params.payload.route ?? params.payload.pageUrl ?? 'unknown',
				httpStatus: 0,
				durationMs: 0,
				ip: params.ip ?? null,
				userAgent: params.userAgent ?? params.payload.userAgent ?? null,
				requestBody: null,
				responseBody: null,
				errorDetail: params.payload.message ?? null,
				errorStack: params.payload.stack ?? null,
				metadata: this.toLogJson({
					pageUrl: params.payload.pageUrl,
					route: params.payload.route,
					componentStack: params.payload.componentStack,
					release: params.payload.release,
					source: params.payload.source,
					metadata: params.payload.metadata,
				}),
			},
			select: { id: true, createdAt: true },
		});

		const timestamp = created.createdAt.toISOString();
		await this.maybeNotifyTelegram({ timestamp, errorLogId: created.id, payload: params.payload });

		return { id: created.id };
	}
}
