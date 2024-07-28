import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

import { get } from 'svelte/store';
import { serVars, getValueFromName } from '../../../stores/variables';

const { sign } = jwt;

const refreshSecret = getValueFromName('refresh_secret', true);
const accessSecret = getValueFromName('access_secret', true);

function checkSecret(refreshSec: any, accessSec: any) {
	return (
		refreshSec &&
		accessSec &&
		refreshSec !== undefined &&
		accessSec !== undefined &&
		typeof refreshSec === 'string' &&
		typeof accessSec === 'string' &&
		refreshSec.length > 0 &&
		accessSec.length > 0
	);
}

export const POST: RequestHandler = async ({ request }) => {
	const { username, password } = await request.json();
	const savedUsername = get(serVars).find((v) => v.name === 'username')?.value;
	const savedPassword = get(serVars).find((v) => v.name === 'password')?.value;

	// authentication
	if (username === savedUsername && password === savedPassword) {
		console.log('login successful');

		const refreshSecret = get(serVars).find((v) => v.name === 'refresh_secret')?.value;
		const accessSecret = get(serVars).find((v) => v.name === 'access_secret')?.value;
		const accessMaxAge = get(serVars).find((v) => v.name === 'access_token_max_age')
			?.value as number;
		const refreshMaxAge = get(serVars).find((v) => v.name === 'refresh_token_max_age')
			?.value as number;

		if (!checkSecret(refreshSecret, accessSecret)) {
			return json(
				{ message: 'Server error', error: 'Refresh or access secret is not valid' },
				{ status: 500 }
			);
		}
		const refreshToken = sign({ username }, refreshSecret as string);
		const accessToken = sign({ username }, accessSecret as string);

		// prepare cookies
		const accessExpires = new Date(Date.now() + accessMaxAge * 1000);
		const accessCookie = serialize('access_token', accessToken, {
			httpOnly: false,
			sameSite: 'strict',
			expires: accessExpires,
			path: '/'
		});

		const refreshExpires = new Date(Date.now() + refreshMaxAge * 24 * 60 * 60 * 1000);

		const refreshCookie = serialize('refresh_token', refreshToken, {
			httpOnly: false,
			sameSite: 'strict',
			expires: refreshExpires,
			path: '/'
		});

		return new Response(JSON.stringify({ message: 'Token sent successfully!' }), {
			status: 200,
			headers: {
				'Set-Cookie': `${accessCookie}, ${refreshCookie}`,
				'Content-Type': 'application/json'
			}
		});
	} else {
		// Failed login response
		return json({ message: 'Invalid username or password' }, { status: 401 });
	}
};
