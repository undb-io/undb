<script lang="ts">
	import CellComponent from '$lib/cell/CellComponents/CellComponent.svelte'
	import { getCellValue } from '$lib/cell/get-cell-value'
	import { getTable } from '$lib/store/table'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import type { Record } from '@undb/core'
	import { Card, Tooltip } from 'flowbite-svelte'
	import { fade } from 'svelte/transition'

	export let record: Record
	const table = getTable()

	$: values = record.values.valuesPair
</script>

<Card
	rounded={false}
	class="!py-4 !px-4 shadow-sm rounded-md hover:shadow-md duration-200 cursor-grab select-none space-y-2 text-gray-700 text-sm"
	{...$$restProps}
>
	{#each Object.entries(values) as [key, value]}
		{@const field = $table.schema.getFieldById(key).unwrap()}
		<div class="flex items-center gap-2 dark:text-gray-200">
			<FieldIcon size={20} type={field.type} />
			<Tooltip class="z-[999]" transition={fade} params={{ delay: 100, duration: 200 }} placement="left" arrow={false}>
				{field.name.value}
			</Tooltip>
			<CellComponent {field} value={getCellValue(field, value)} displayValues={record.displayValues?.unpack()} />
		</div>
	{/each}
</Card>
