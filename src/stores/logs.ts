import { writable } from 'svelte/store';
import { resetVariables } from './variables';

export const Status = writable(0);

export const resetStatus = () => {
	resetVariables();
	Status.set(0);
};
