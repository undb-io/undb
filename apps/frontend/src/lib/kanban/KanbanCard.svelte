<script lang="ts">
	import { cn } from '$lib/utils'
	import CellComponent from '$lib/cell/CellComponents/CellComponent.svelte'
	import { getTable, getView, readonly } from '$lib/store/table'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import type { Record } from '@undb/core'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { fade } from 'svelte/transition'
	import * as Card from '$lib/components/ui/card'

	export let record: Record
	const table = getTable()
	const view = getView()

	$: fields = $table.getOrderedFields($view)
</script>

<Card.Root
	class={cn(
		'!py-4 !px-4 shadow-sm rounded-md hover:shadow-md duration-200 select-none space-y-2 text-gray-700 text-sm overflow-hidden',
		$readonly ? 'cursor-pointer' : 'cursor-grab',
	)}
	{...$$restProps}
>
	{#each fields as field}
		{@const value = record.values.value.get(field.id.value)}
		<div class="flex items-center gap-2 dark:text-gray-200">
			<Tooltip.Root>
				<Tooltip.Trigger>
					<FieldIcon size={20} type={field.type} />
				</Tooltip.Trigger>
				<Tooltip.Content>
					{field.name.value}
				</Tooltip.Content>
			</Tooltip.Root>

			<CellComponent {record} {field} {value} displayValues={record.displayValues?.unpack()} />
		</div>
	{/each}
</Card.Root>
