<script lang='ts'>
    import type { Variable } from '../stores/variables';
	export let title = '';
	export let data = <Variable[]>[];
    // export const variables: Variable[] = JSON.parse(data);

</script>

<div class="flex flex-col p-2 items-start bg-darkgray  w-1/2 mx-3 my-2 h-36 overflow-scroll">
	<div>
		<p class=" text-lightgreen">{title}</p>
	</div>
	<div
		class="w-full p-1 text-varcontent flex flex-col space-y-1 overflow-scroll"
	>
		{#each data as { name, value }}
            <p class="text-varcontent">{name}:&nbsp{value}</p>
        {/each}
	</div>
</div>
