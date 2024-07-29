export const clientSourceCode: [file:string, content:string] [] = [
    ['',''],
    ['src/components/navbar.svelte', `<input
        class="text-darkgray mt-[4px] p-[8px] rounded-sm border-[1px] border-gray-300"
        type="text"
        id="username"
        bind:value={username}
        placeholder="ironman"
        required
/>
<input
class="text-darkgray mt-[4px] p-[8px] rounded-sm border-[1px] border-gray-500"
type="password"
id="password"
bind:value={password}
placeholder="fingercrossed"
required
/>`],
    ['src/lib/steps.ts',
    `const response = await axios.post('/api/login', {
			username,
			password
		});
		if (response.status === 200) {
			// update logged in status
			updateVariable({ name: 'logged_in', value: true }, false);
			const document = get(doc);
            
			// get cookies from local storage
			if (document) {

				// get cookies from local storage
				const cookies = cookie.parse(document.cookie);
				const accessToken = cookies.access_token || '';
				const refresh_token = cookies.rephreshToken || "can't access from JavaScript";
				
                // refresh token can't be accessed through javascript
				console.log('refresh token:', refresh_token);

				// update tokens in variables
				updateVariable({ name: 'access_token', value: accessToken }, false);
				updateVariable({ name: 'refresh_token', value: refresh_token }, false);
			}}}`
    ],
    ['src/lib/steps.ts',
    `export async function refreshToken() {
	try {
		const response = await axios.post('/api/refresh-token', {}, { withCredentials: true });
		if (response.status === 200) {

			const document = get(doc);
			// get cookies from local storage
			if (document) {
				const cookies = cookie.parse(document.cookie);
				const accessToken = cookies.access_token || '';

				// update tokens in variables
				updateVariable({ name: 'access_token', value: accessToken }, false);
				Steps.set(2);
			}
			else{
				console.log('document not found');
			}
		}
	  }
	catch (error) {
		console.log('error while refreshing token:', error);
	}
}`],
    ['src/lib/steps.ts',
        `export async function accessData() {
	const Document = get(doc);
	if (!Document) return;

	// get accessToken from local storage
	const cookies = cookie.parse(document.cookie);
	const accessToken = cookies.access_token;

	if (!accessToken) {
		console.log('access token not found');
		// accessToken expires
		// go to next step to refresh the access token
		Steps.set(3);
		return;
	}

	try {
		const response = await axios.get('/api/protected-data', {
			headers: {
				Authorization: \`Bearer \${accessToken}\`
			}
		});
		if (response.status === 200) {
			const { protectedData } = response.data;
			console.log('Received protected data:', protectedData);

			// update steps
			updateVariable({ name: 'secret_data', value: protectedData }, false);

			// update Step
			Steps.set(4);
		}
	} catch (error) {
		console.log('error while accessing data:', error);
	}
}`]
];
export const servSourceCode: [file:string, content:string][] = [
    ['',''],    
    ['',''],
    ['/src/routes/api/login/+server.ts',
    `export const POST: RequestHandler = async ({ request }) => {

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
				'Set-Cookie': '\${accessCookie}, \${refreshCookie}',
				'Content-Type': 'application/json'
			}
		});
	} else {
		// Failed login response
		return json({ message: 'Invalid username or password' }, { status: 401 });
	}
};`],
    ['/src/routes/api/refresh-token/+server.ts',
    `try {
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
	}`],
    ['/src/routes/api/protected-data/+server.ts',
    `export const GET: RequestHandler = async ({ request }) => {

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
        
        // token is correct , sending data
        const protectedData = get(serVars).find((v) => v.name === 'secret_data')?.value;
        return json({ message: 'Protected data', protectedData});
    }
    catch (err){
        return new Response(JSON.stringify({ error: err }), { status: 401 });
    }
}`]
];
