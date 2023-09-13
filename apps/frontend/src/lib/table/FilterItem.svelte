<script lang="ts">
	import { cn } from '$lib/utils'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { Button } from '$lib/components/ui/button'
	import FilterOperatorPicker from './FilterOperatorPicker.svelte'
	import { isFilterable, type Field, type IFilter, isOperatorWithoutValue, type IQueryFieldSchema } from '@undb/core'
	import { allTableFields, getTable } from '$lib/store/table'
	import FilterValue from './FilterValue.svelte'
	export let filter: Partial<IFilter>

	export let index: number
	export let remove: (index: number) => void
	export let field: Field | undefined = undefined
	export let readonly = false
	export let fieldFilter: (field: IQueryFieldSchema) => boolean = () => true

	const table = getTable()

	let selectedId: string | undefined
	$: field = selectedId ? $table.schema.getFieldById(selectedId).into() : undefined

	$: withoutValue = !!filter.operator && isOperatorWithoutValue(filter.operator)
</script>

<li class="flex h-10 items-center justify-between gap-2 dark:border-gray-200">
	{#if !readonly}
		<i role="button" class="handle ti ti-grip-vertical dark:text-white" />
	{/if}
	<div class="grid grid-cols-3 gap-2 flex-1">
		<FieldPicker
			bind:selectedId
			bind:value={filter.path}
			bind:type={filter.type}
			fields={$allTableFields}
			filter={(f) => isFilterable(f.type) && fieldFilter(f)}
			{readonly}
		/>
		<FilterOperatorPicker
			{field}
			class={cn('h-9 py-1 text-sm', 'w-full', withoutValue && 'col-span-2')}
			bind:value={filter.operator}
			readonly={readonly || !field}
		/>
		<FilterValue
			{field}
			{readonly}
			size="sm"
			operator={filter.operator}
			bind:value={filter.value}
			class="h-9 !rounded-none rounded-r-sm"
		/>
	</div>
	{#if !readonly}
		<Button
			class="h-9 aspect-square !p-0 border-gray-100"
			size="sm"
			variant="outline"
			on:click={() => remove(index)}
			type="button"
		>
			<i class="ti ti-trash text-sm" />
		</Button>
	{/if}
</li>
