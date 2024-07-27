import { writable } from 'svelte/store';

export type Log = {
	message: string;
	count: number;
};

export const Server = writable<Log[]>([]);
export const Client = writable<Log[]>([]);

export const addLog = (message: string, server: boolean) => {
	console.log(message);
	let logs = server ? Server : Client;
	logs.update((currentLogs) => {
		const lastMessage = currentLogs[currentLogs.length - 1];
		if (lastMessage?.message === message) {
			lastMessage.count++;
			return [...currentLogs];
		}
		return [...currentLogs, { message, count: 1 }];
	});
};

export const clearLogs = () => {
	console.clear();
	Server.set([]);
    Client.set([]);
};
