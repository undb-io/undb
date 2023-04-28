<script lang="ts">
	import cx from 'classnames'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { Button } from 'flowbite-svelte'
	import FilterOperatorPicker from './FilterOperatorPicker.svelte'
	import type { Field, IFilter } from '@undb/core'
	import { getTable } from '$lib/store/table'
	import FilterValue from './FilterValue.svelte'

	export let filter: Partial<IFilter>
	export let index: number
	export let reset: (index: number, field: Field | undefined) => void
	export let remove: (index: number) => void

	const table = getTable()

	let field: Field | undefined

	// $: field?.id.value, reset(index)
</script>

<li class="flex h-8 items-center">
	<FieldPicker
		bind:selected={field}
		size="xs"
		class="h-8 rounded-l-sm rounded-r-none w-32"
		table={$table}
		bind:value={filter.path}
		bind:type={filter.type}
		filter={(f) => f.filterable}
		on:change={() => reset(index, field)}
	/>
	<FilterOperatorPicker
		{field}
		size="sm"
		class={cx('h-8 !rounded-none w-full border-l-0 border-r-0 py-1')}
		bind:value={filter.operator}
	/>
	<FilterValue {field} operator={filter.operator} bind:value={filter.value} class="h-8 !rounded-none rounded-r-sm" />
	<Button
		color="light"
		class="h-8 aspect-square !rounded-l-none !rounded-r-sm !p-0 border-l-0 border-gray-200"
		size="xs"
		on:click={() => remove(index)}
	>
		<i class="ti ti-trash text-sm" />
	</Button>
</li>
