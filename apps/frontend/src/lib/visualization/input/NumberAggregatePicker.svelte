<script lang="ts">
	import { t } from '$lib/i18n'
	import { numberAggregateFunctions, type INumberAggregateFunction, type SelectField } from '@undb/core'
	import * as RadioGroup from '$lib/components/ui/radio-group'
	import Label from '$components/ui/label/label.svelte'

	export let value: INumberAggregateFunction = 'sum'
</script>

<ul
	class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x divide-gray-200 dark:divide-gray-600"
>
	<RadioGroup.Root bind:value>
		{#each numberAggregateFunctions as func}
			<li class="w-full">
				<Label class="w-full cursor-pointer text-center flex justify-center">
					<span
						class="whitespace-nowrap text-xs hover:text-blue-500 peer-checked:text-blue-500 peer-checked:border-blue-500 peer-checked:border block w-full h-full p-1"
					>
						{$t(func, { ns: 'common' })}
					</span>

					<RadioGroup.Item value={func} />
				</Label>
			</li>
		{/each}
	</RadioGroup.Root>
</ul>
