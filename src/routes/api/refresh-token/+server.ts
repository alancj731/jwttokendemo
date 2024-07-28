import type { RequestHandler } from '@sveltejs/kit';
import cookie from 'cookie';
import { serialize } from 'cookie';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { get } from 'svelte/store';
import { serVars } from '../../../stores/variables';

export const POST: RequestHandler = async ({ request }) => {
	const refreshSecret = get(serVars).find((v) => v.name === 'refresh_secret')?.value;
    const accessSecret = get(serVars).find((v) => v.name === 'access_secret')?.value;
	const accessMaxAge = get(serVars).find((v) => v.name === 'access_token_max_age')?.value as number
    

	if (!refreshSecret || !accessSecret || typeof(refreshSecret)!== 'string' || typeof(accessSecret)!== 'string') {
        return new Response(JSON.stringify({ error: 'No saved refresh secret found' }), { status: 401 });
    }
	const cookies = request.headers.get('cookie');
	if (!cookies) {
		return new Response(JSON.stringify({ error: 'No cookies' }), { status: 401 });
	}
	const parsedCookies = cookie.parse(cookies);
	const refreshToken = parsedCookies['refresh_token'];

	if (!refreshToken) {
		return new Response(JSON.stringify({ error: 'Refresh token missing' }), { status: 401 });
	}

	try {
		// to do, need to check here if payload is valid
		const payload = jwt.verify(refreshToken, refreshSecret ) as JwtPayload;
		
		
		const newAccessToken = jwt.sign({ username: payload.username }, accessSecret);

		const accessExpires = new Date(Date.now() + accessMaxAge * 1000);

		const accessCookie = serialize('access_token', newAccessToken, {
			httpOnly: false,
			sameSite: 'strict',
			expires: accessExpires,
			path: '/'
		});

		return new Response(JSON.stringify({ message: 'Token sent successfully!' }), {
			status: 200,
			headers: {
				'Set-Cookie': accessCookie,
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid refresh token' }), { status: 401 });
	}
};
