<script lang="ts">
	import cx from 'classnames'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { Button } from 'flowbite-svelte'
	import FilterOperatorPicker from './FilterOperatorPicker.svelte'
	import { isFilterable, type Field, type IFilter, isOperatorWithoutValue } from '@undb/core'
	import { allTableFields, getTable } from '$lib/store/table'
	import FilterValue from './FilterValue.svelte'
	export let filter: Partial<IFilter>

	export let index: number
	export let remove: (index: number) => void
	export let field: Field | undefined = undefined
	export let readonly = false

	const table = getTable()

	let selectedId: string | undefined
	$: field = selectedId ? $table.schema.getFieldById(selectedId).into() : undefined

	$: withoutValue = !!filter.operator && isOperatorWithoutValue(filter.operator)
</script>

<li class="flex h-10 items-center justify-between gap-2 dark:border-gray-200">
	{#if !readonly}
		<i role="button" class="handle ti ti-grip-vertical" />
	{/if}
	<div class="grid grid-cols-3 gap-2 flex-1">
		<FieldPicker
			bind:selectedId
			size="xs"
			class="h-10 w-full !justify-start"
			table={$table}
			bind:value={filter.path}
			bind:type={filter.type}
			fields={$allTableFields}
			filter={(f) => isFilterable(f.type)}
			{readonly}
		/>
		<FilterOperatorPicker
			{field}
			size="sm"
			class={cx('h-10 py-1', 'w-full', withoutValue && 'col-span-2')}
			bind:value={filter.operator}
			{readonly}
		/>
		<FilterValue
			{field}
			{readonly}
			operator={filter.operator}
			bind:value={filter.value}
			class="h-10 !rounded-none rounded-r-sm"
		/>
	</div>
	{#if !readonly}
		<Button color="light" class="h-10 aspect-square !p-0 border-gray-100" size="xs" on:click={() => remove(index)}>
			<i class="ti ti-trash text-sm" />
		</Button>
	{/if}
</li>
