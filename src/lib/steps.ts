import { get } from "svelte/store";
import { cliVars } from "../stores/variables";

export function login(){
    const username = get(cliVars).find((v) => v.name === 'username')?.value;
    const password = get(cliVars).find((v) => v.name === 'password')?.value;

    console.log(username, password);
}