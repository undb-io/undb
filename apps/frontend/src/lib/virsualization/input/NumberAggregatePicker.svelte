<script lang="ts">
	import { numberAggregateFunctions, type INumberAggregateFunction, type SelectField } from '@undb/core'
	import { Radio } from 'flowbite-svelte'

	export let value: INumberAggregateFunction | undefined
</script>

<ul
	class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x divide-gray-200 dark:divide-gray-600"
>
	{#each numberAggregateFunctions as func}
		<li class="w-full"><Radio value={func} bind:group={value} class="p-3">{func}</Radio></li>
	{/each}
</ul>
