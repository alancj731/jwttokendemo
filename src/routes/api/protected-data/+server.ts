import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

import { get } from 'svelte/store';
import { serVars, updateVariable, getValueFromName } from '../../../stores/variables';

const { sign, verify, decode } = jwt;

export const GET: RequestHandler = async ({ request }) => {

    const authHeader = request.headers.get('Authorization')

    if (!authHeader)  {
        return new Response(JSON.stringify({ error: 'Authorization header missing' }), { status: 401 });
    }

    const accessToken = authHeader.split(' ')[1]

    if (!accessToken) return new Response(JSON.stringify({ error: 'Token missing' }), { status: 401 });

    try{
        const accessSecret = get(serVars).find((v) => v.name === 'access_secret')?.value
        console.log(accessSecret)

        if (!accessSecret || typeof(accessSecret)!== 'string'){
            return new Response(JSON.stringify({ error: 'No valid access secret found!' }), { status: 401 });
        }

        const payload = jwt.verify(accessToken, accessSecret);
        
        // token is correct , response with data
        const protectedData = get(serVars).find((v) => v.name === 'secret_data')?.value;
        return json({ message: 'Protected data', protectedData});
    }
    catch (err){
        return new Response(JSON.stringify({ error: err }), { status: 401 });
    }
}