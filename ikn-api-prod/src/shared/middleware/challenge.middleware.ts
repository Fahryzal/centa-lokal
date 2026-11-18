// challenge.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthChallengeService } from '@src/modules/auth/auth-challenge/auth-challenge.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ChallengeMiddleware implements NestMiddleware {
	constructor(private readonly authService: AuthChallengeService) {}

	use(req: Request, res: Response, next: NextFunction) {
		const challenge = req.headers['x-client-challenge'] as string;
		const clientId = req.headers['x-client-id'] as string;

		if (!challenge || !clientId) {
			return res.status(403).json({ message: 'Missing headers', status: 403 });
		}

		const isValid = this.authService.verifyChallenge(clientId, challenge);
		if (!isValid) {
			return res.status(403).json({ message: 'Invalid challenge', status: 403 });
		}

		next();
	}
}
