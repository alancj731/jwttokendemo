import { get } from 'svelte/store';
import { cliVars, updateVariable } from '../stores/variables';
import { Steps, resetSteps } from '../stores/steps';
import { doc } from '../stores/document';
import cookie from 'cookie';
import axios from 'axios';

export async function login() {
	const username = get(cliVars).find((v) => v.name === 'username')?.value;
	const password = get(cliVars).find((v) => v.name === 'password')?.value;

	try {
		const response = await axios.post('/api/login', {
			username,
			password
		});
		console.log('response status:', response.status);
		if (response.status === 200) {
			// update logged in status
			updateVariable({ name: 'logged_in', value: true }, false);
			const document = get(doc);
			// get cookies from local storage
			if (document){
				const cookies = cookie.parse(document.cookie);
				const accessToken = cookies.access_token || "";
				const refresh_token = cookies.rephreshToken || "not allowed to access from JavaScript";
				// refresh token can't be accessed through javascript
				console.log('refresh token:', refresh_token);
				// update tokens in variables
				updateVariable({ name: 'access_token', value: accessToken }, false);
				updateVariable({ name: 'refresh_token', value: refresh_token }, false);
			}

			// update steps
			Steps.update((current) => {
				return current + 1;
			});
			console.log('steps after successful login:', get(Steps));
		} else {
			console.error('Unsucessful login!', response.data.message);
			// return to initial status
			resetSteps();
		}
	} catch (error) {
		console.error('login failed!', error);
		// return to initial status
		resetSteps();
	}
}
