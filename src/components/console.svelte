<script lang="ts">
	// export props passed in
	export let side = 'side';
	
	import { get } from 'svelte/store';
	import { Server, Client } from '../stores/logs';
	import type { Log } from '../stores/logs';
	
	let client: Log[] = [];
	let server: Log[] = [];
	let localLogs: Log[] = [];

	$: client = $Client;
	$: server = $Server;

	$: {
		localLogs = side === 'client' ? client : server;
	}
	
</script>

<div class="flex flex-col w-1/2 items-start bg-white min-h-36 mx-3 p-2 overflow-scroll">
	<p class="text-logstitle ml-4 font-bold">{side} &nbsp console:</p>
	<div class="flex flex-col space-y-[1px]">
		{#each localLogs as log}
			{#if log.count !== 1}
				<div class="inline-flex">
					<div class="flex bg-slate-500 items-center justify-center rounded-full w-5 h-5 mr-1 mt-[5px]">
						<p class="text-white text-[16px] text-center">{log.count}</p>
					</div>
					<p class="text-logscontent text-[18px]"> {log.message}</p>
				</div>
			{:else}
				<p class="text-logscontent text-[18px] ml-6">{log.message}</p>
			{/if}
		{/each}
	</div>
</div>
