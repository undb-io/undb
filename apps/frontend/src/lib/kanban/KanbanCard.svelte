<script lang="ts">
	import CellComponent from '$lib/cell/CellComponent.svelte'
	import { getCellValue } from '$lib/cell/get-cell-value'
	import { getTable, getView } from '$lib/store/table'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import type { Record } from '@undb/core'
	import { Card } from 'flowbite-svelte'

	export let record: Record
	const table = getTable()
	const view = getView()

	const values = record.values.valuesPair
</script>

<Card rounded={false} class="!py-4 !px-4 shadow-sm hover:shadow-lg duration-200 cursor-grab select-none">
	{#each Object.entries(values) as [key, value]}
		{@const field = $table.schema.getFieldById(key).unwrap()}
		<div class="flex items-center gap-2">
			<FieldIcon size={20} type={field.type} />
			<CellComponent {field} value={getCellValue(field, value)} />
		</div>
	{/each}
</Card>
