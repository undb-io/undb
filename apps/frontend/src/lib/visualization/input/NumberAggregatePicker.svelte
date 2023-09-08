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
	<RadioGroup.Root bind:value class="p-3">
		{#each numberAggregateFunctions as func}
			<li class="w-full">
				<Label class="w-full cursor-pointer text-center flex justify-start items-center">
					<RadioGroup.Item value={func} />
					<span
						class="whitespace-nowrap text-xs hover:text-primary-500 peer-checked:text-primary-500 peer-checked:border-primary-500 peer-checked:border block h-full p-1"
					>
						{$t(func, { ns: 'common' })}
					</span>
				</Label>
			</li>
		{/each}
	</RadioGroup.Root>
</ul>
