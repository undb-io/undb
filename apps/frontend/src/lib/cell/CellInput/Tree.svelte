<script lang="ts">
	import { RecordFactory, TreeField } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { currentRecordId, getRecords, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'

	export let value: string[] = []
	export let field: TreeField

	const table = getTable()

	async function getForeignRecords() {
		const data = await trpc().record.tree.available.utils.fetch({
			tableId: $table.id.value,
			treeFieldId: field.id.value,
			recordId: $currentRecordId,
		})

		return RecordFactory.fromQueryRecords(data.records, $table.schema.toIdMap())
	}

	const tableRecords = getRecords()
	async function getInitRecords() {
		return $tableRecords.filter((r) => value.includes(r.id.value))
	}
</script>

<ForeignRecordsPicker
	{field}
	{getForeignRecords}
	{getInitRecords}
	bind:value
	foreignTableId={$table.id.value}
	{...$$restProps}
/>
