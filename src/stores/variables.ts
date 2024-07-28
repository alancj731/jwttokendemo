import { writable, get } from 'svelte/store';

export type Variable = {
	name: string;
	value: string | number | boolean | null | undefined;
};

const initSerVars: Variable[] = [
	{ name: 'username', value: 'ironman' },
	{ name: 'password', value: 'fingercross' },
	{ name: 'access_secret', value: 'jarvis' },
	{ name: 'refresh_secret', value: 'pepper' },
	{ name: 'access_token_max_age', value: 10 }, // in seconds
	{ name: 'refresh_token_max_age', value: 5 }, // in days
	{ name: 'rephress_token', value: null },
	{ name: 'secret_data', value: 'Infinity Gauntlet' }
];

const initCliVars: Variable[] = [
	{ name: 'username', value: '' },
	{ name: 'password', value: '' },
	{ name: 'access_token', value: null },
	{ name: 'refresh_token', value: null },
	{ name: 'logged_in', value: false },
	{ name: 'secret_data', value: null }
];

export const serVars = writable<Variable[]>([...initSerVars]);
export const cliVars = writable<Variable[]>([...initCliVars]);

export const getValueFromName = (name: string, server: boolean) => {
	let currentVars = server ? get(serVars) : get(cliVars);

	const found = currentVars.filter((element) => {
		element.name === name;
	});
	return found.length > 0 ? found[0].value : null;
};

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
	serVars.set([...initSerVars]);
	cliVars.set([...initCliVars]);
	deleteCookie('demo_token');
};
