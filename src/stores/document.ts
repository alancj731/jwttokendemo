import { writable } from "svelte/store";

export const doc = writable<Document | null>(null);