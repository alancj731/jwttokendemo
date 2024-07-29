<script lang="ts">
	import { cliVars, serVars } from '../stores/variables';
	import type { Variable } from '../stores/variables';
	export let title = '';
	export let cliData: Variable[]=[];
	export let serData: Variable[]=[];
	$: cliData = $cliVars;
	$: serData = $serVars;
</script>

<div class="flex flex-col p-2 items-start bg-darkgray w-1/2 mx-3 my-2 h-44 overflow-scroll">
	<div>
		<p class=" text-lightgreen">{title}</p>
	</div>
	<div class="w-full p-1 text-varcontent flex flex-col space-y-1 overflow-scroll">
		{#if title === 'client side:'}
			{#each cliData as { name, value }}
				<div class="flex flex-1">
					<p class="text-varcontent">{name}:&nbsp&nbsp</p>
					<p class="text-lightpink">{value}</p>
				</div>
			{/each}
		{:else}
			{#each serData as { name, value }}
				<div class="flex flex-1">
					<p class="text-varcontent">{name}:&nbsp&nbsp</p>
					<p class="text-pinkred">{value}</p>
				</div>
			{/each}
		{/if}
	</div>
</div>
