<script lang="ts">
	import { ParentField, RecordFactory, TreeField } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { getRecords, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'

	export let value: string | null
	export let field: ParentField

	const table = getTable()

	async function getForeignRecords() {
		const data = await trpc().record.parent.available.utils.fetch({
			tableId: $table.id.value,
			parentFieldId: field.id.value,
		})

		return RecordFactory.fromQueryRecords(data.records, $table.schema.toIdMap())
	}

	const tableRecords = getRecords()

	async function getInitRecords() {
		return $tableRecords.filter((r) => value === r.id.value)
	}

	let group: string[] = value ? [value] : []

	$: value = group[0] ?? null
</script>

<ForeignRecordsPicker
	{getForeignRecords}
	{getInitRecords}
	{field}
	bind:value={group}
	foreignTableId={$table.id.value}
	{...$$restProps}
/>
