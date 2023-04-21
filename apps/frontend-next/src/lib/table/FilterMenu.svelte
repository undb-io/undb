<script lang="ts">
	import cx from 'classnames'
	import { Button, Dropdown } from 'flowbite-svelte'
	import { IconFilter, IconTrash } from '@tabler/icons-svelte'
	import { filters } from '$lib/store/filter'
	import FieldPicker from '$lib/field/CreateFieldInputs/FieldPicker.svelte'
	import { getTable } from '$lib/context'
	import type { Field } from '@undb/core'
	import FilterOperatorPicker from './FilterOperatorPicker.svelte'
	import FilterValue from './FilterValue.svelte'

	const table = getTable()

	let field: Field | undefined
</script>

<Button size="xs" color="alternative" class="h-[26px] !rounded-sm gap-2">
	<IconFilter size={16} />
	Filters</Button
>
<Dropdown class="p-3 w-[500px]">
	{#each $filters as filter, index}
		<div class="flex h-8 justify-between items-center">
			<div class="flex w-4/5 h-full">
				<FieldPicker
					bind:selected={field}
					size="xs"
					class="rounded-r-none w-32 h-full"
					table={$table}
					bind:value={filter.path}
					bind:type={filter.type}
				/>
				<FilterOperatorPicker
					{field}
					size="sm"
					class={cx('h-full rounded-l-none border-l-0 py-1 w-1/3', {
						'border-r-0': field && filter.operator,
						'rounded-r-none': field && filter.operator,
					})}
					bind:value={filter.operator}
				/>
				{#if field && filter.operator}
					<FilterValue {field} operator={filter.operator} bind:value={filter.value} class="h-full rounded-l-none" />
				{/if}
			</div>
			<div>
				<Button color="light" class="!rounded-none !p-1" size="xs" on:click={() => filters.remove(index)}>
					<IconTrash color="gray" size={16} />
				</Button>
			</div>
		</div>
	{/each}

	<svelte:fragment slot="footer">
		<div class="flex justify-end py-2 px-4">button</div>
	</svelte:fragment>
</Dropdown>
