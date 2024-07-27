<script>
	import SouceCode from '../components/sourcecode.svelte';
	import NavBar from '../components/navbar.svelte';
	import Console from '../components/console.svelte';
	import Variables from '../components/variables.svelte';
	import HttpFlow from '../components/http.svelte';
	import { get } from 'svelte/store';
	import { addLog, clearLogs } from '../stores/logs';
	import { serVars, cliVars} from '../stores/variables';
</script>

<h1 class="text-center p-4 sm:text-2xl sm:p-4 font-bold" style="color: #18181b">
	How JWT token works?
</h1>
<div class="flex flex-col sm:flex-row sm:justify-between">
	<NavBar />
	<div class="flex flex-col">
		<SouceCode title="Client Site Code:" />
		<SouceCode title="Server Site Code:" />
	</div>
</div>
<div class="flex justify-between w-full mt-4" id="consoles container">
	<Console side="client" />
	<Console side="server" />
</div>
<p class="mx-4 mt-2 font-bold text-darkgreen">variables and data in local storage</p>
<div class="flex justify-between">
	<Variables title="client side:" data={get(cliVars)}/>
	<Variables title="server side:" data={get(serVars)}/>
</div>
<p class="mx-4 mt-2 font-bold text-darkgreen">Http request and response</p>
<HttpFlow />
