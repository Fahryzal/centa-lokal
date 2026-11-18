import { Injectable, Scope } from '@nestjs/common';
import * as crypto from 'crypto';
const fakeStore = new Map<string, number>();

// challenge.store.ts
setInterval(() => {
	const now = Date.now();
	for (const [key, expiresAt] of fakeStore) {
		if (expiresAt < now) fakeStore.delete(key);
	}
}, 60_000); // bersihkan tiap 60 detik

@Injectable({ scope: Scope.REQUEST })
export class AuthChallengeService {
	private readonly secret = process.env.FRONTEND_SHARED_SECRET;

	generateChallenge(): { challenge: string; expiresAt: number } {
		const challenge = crypto.randomBytes(16).toString('hex');
		const expiresAt = Date.now() + 60_000; // berlaku 60 detik

		// simpan challenge di memory atau Redis
		fakeStore[challenge] = expiresAt;

		return { challenge, expiresAt };
	}

	verifyChallenge(challenge: string, clientHash: string): boolean {
		const expiresAt = fakeStore[challenge];
		if (!expiresAt || Date.now() > expiresAt) return false;

		const expectedHash = crypto.createHmac('sha256', this.secret).update(challenge).digest('hex');

		return expectedHash === clientHash;
	}
}
