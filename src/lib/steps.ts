import { get } from 'svelte/store';
import { cliVars, updateVariable, getValueFromName } from '../stores/variables';
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
		if (response.status === 200) {
			// update logged in status
			updateVariable({ name: 'logged_in', value: true }, false);
			const document = get(doc);
			// get cookies from local storage
			if (document) {
				const cookies = cookie.parse(document.cookie);
				const accessToken = cookies.access_token || '';
				const refresh_token = cookies.rephreshToken || "can't access from JavaScript";
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

export async function refreshToken() {
	try {
		const response = await axios.post('/api/refresh-token', {}, { withCredentials: true });
		if (response.status === 200) {

			const document = get(doc);
			// get cookies from local storage
			if (document) {
				const cookies = cookie.parse(document.cookie);
				const accessToken = cookies.access_token || '';
				console.log('Received new access token:', accessToken);
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
}

export async function accessData() {
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
				Authorization: `Bearer ${accessToken}`
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
}
