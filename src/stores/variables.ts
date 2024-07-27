import { writable } from 'svelte/store';

export type Variable = {
	name: string;
	value: string | number | boolean | null | undefined;
};

const initSerVars: Variable[] = [
	{ name: 'username', value: 'ironman' },
	{ name: 'password', value: 'fingercross' },
	{ name: 'access_secrect', value: 'jarvis' },
	{ name: 'refresh_secret', value: 'pepper' },
	{ name: 'token_valid_tiem', value: 5 }, // in seconds
	{ name: 'rephress_token', value: null },
	{ name: 'secret_data', value: 'Infinity Gauntlet' }
];

const initCliVars: Variable[] = [
	{ name: 'username', value: '' },
	{ name: 'password', value: '' },
	{ name: 'access_token', value: null },
	{ name: 'refresh_token', value: null },
	{ name: 'logged in', value: false },
	{ name: 'secret_data', value: null }
];

export const serVars = writable<Variable[]>(initSerVars);
export const cliVars = writable<Variable[]>(initCliVars);

export const updateVariable = (variable: Variable, server: boolean) => {
	let currentVars = server ? serVars : cliVars;
	currentVars.update((current) => {
		const index = current.findIndex((v) => v.name === variable.name);
		if (index === -1) {
			return [...current, variable];
		}
		current[index] = variable;
		return [...current];
	});
};

function deleteCookie(name: string) {
	if (document) document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export const resetVariables = () => {
	serVars.set(initSerVars);
	deleteCookie('demo_token');
	cliVars.set(initCliVars);
};
