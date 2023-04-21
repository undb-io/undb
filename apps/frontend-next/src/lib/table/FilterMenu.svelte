<script lang="ts">
	import cx from 'classnames'
	import { Button, ButtonGroup, Dropdown, Hr, P } from 'flowbite-svelte'
	import { IconFilter, IconTrash } from '@tabler/icons-svelte'
	import { filters } from '$lib/store/filter'
	import FieldPicker from '$lib/field/CreateFieldInputs/FieldPicker.svelte'
	import { getTable } from '$lib/context'
	import autoAnimate from '@formkit/auto-animate'
	import type { Field } from '@undb/core'
	import FilterOperatorPicker from './FilterOperatorPicker.svelte'
	import FilterValue from './FilterValue.svelte'

	const table = getTable()

	let field: Field | undefined
	let open = false
</script>

<Button id="filters" size="xs" color="alternative" class="h-full !rounded-md gap-2">
	<IconFilter size={16} />
	Filters</Button
>
<Dropdown inline bind:open triggeredBy="#filters" class="p-3 w-[500px]" frameClass="shadow-2xl">
	<span slot="header" class="px-4 text-xs font-medium text-gray-500">set filters in this view</span>
	<ul class="space-y-2" use:autoAnimate={{ duration: 100 }}>
		{#each $filters as filter, index}
			<li class="flex h-8 justify-between items-center">
				<ButtonGroup class="w-4/5 h-full">
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
				</ButtonGroup>
				<div>
					<Button color="light" class="!rounded-none !p-1" size="xs" on:click={() => filters.remove(index)}>
						<IconTrash color="gray" size={16} />
					</Button>
				</div>
			</li>
		{/each}
	</ul>
	<svelte:fragment slot="footer">
		<div class="flex justify-between py-2 px-4">
			<div>
				<Button color="alternative" size="xs" on:click={filters.add}>Add New Filter</Button>
			</div>
			<div>button2</div>
		</div>
	</svelte:fragment>
</Dropdown>
