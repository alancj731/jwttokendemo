<script lang="ts">
	export let title = 'title';
	import { Steps } from '../stores/steps';
    import { clientSourceCode, servSourceCode } from '../lib/soucecode';
	export const sourceCode = title === 'client' ? clientSourceCode : servSourceCode;
</script>

<div class="flex flex-col itmes-start mt-0">
	<div class="m-1 mt-2 mb-0 text-darkgreen font-semibold w-full sm: ml-[9px] px-2 sm:w-[130px]">
		<i class="fa fa-code"> &nbsp&nbsp {title} </i>
	</div>
    <div
		class="w-full text-xs whitespace-pre ml-2 bg-darkgray text-lightpink sm:w-[455px]"
	>
		{sourceCode[$Steps][0]}
	</div>

	<div
		class="w-full text-xs whitespace-pre overflow-scroll h-[100px] px-4 mx-1 rounded-sm border border-[#e4e4e7] border-1[px] bg-darkgray text-darkgreen sm:min-h-[136px] ml-2 mr-3 sm:w-[465px]"
	>
		{sourceCode[$Steps][1]}
	</div>
</div>
