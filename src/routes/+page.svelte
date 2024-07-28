<script>
	import SouceCode from '../components/sourcecode.svelte';
	import NavBar from '../components/navbar.svelte';
	import Console from '../components/console.svelte';
	import Expain from '../components/explain.svelte';
	import Variables from '../components/variables.svelte';
	import HttpFlow from '../components/http.svelte';
	import { get } from 'svelte/store';
	import { addLog, clearLogs } from '../stores/logs';
	import { serVars, cliVars } from '../stores/variables';
	import jwt from '../../public/jwt.svg';
</script>

<div class="flex w-full justify-center p-4 sm:text-xl sm:p-4 font-bold" style="color: #18181b">
	How does &nbsp <img src="../../public/jwt.svg" alt="JWT logo" /> &nbsp token work &nbsp
	<i class="fa fa-circle-question mt-[5px]"></i>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between">
	<NavBar />
	<div class="flex flex-col">
		<SouceCode title="client" />
		<SouceCode title="server" />
	</div>
</div>
<div class="border border-solid m-3">
	<Expain />
</div>
<p class="mx-4 mt-2 font-bold text-darkgreen">variables and data in local storage</p>
<div class="flex justify-between">
	<Variables title="client side:" data={get(cliVars)} />
	<Variables title="server side:" data={get(serVars)} />
</div>
<p class="mx-4 mt-2 font-bold text-darkgreen">Http request and response</p>
<HttpFlow />
