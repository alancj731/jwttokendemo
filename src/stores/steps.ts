import { writable } from 'svelte/store';
import { resetVariables } from './variables';

export const Steps = writable(0);

export const resetSteps = () => {
	resetVariables();
	Steps.set(0);
};
