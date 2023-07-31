<script lang="ts">
	import { RecordFactory, TreeField } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { currentRecordId, getTable, recordsStore } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'

	export let value: string[] = []
	export let field: TreeField

	const table = getTable()

	async function getForeignRecords(q?: string) {
		const data = await trpc().record.tree.available.utils.fetch({
			tableId: $table.id.value,
			treeFieldId: field.id.value,
			recordId: $currentRecordId,
			q,
		})

		return RecordFactory.fromQueryRecords(data.records, $table.schema.toIdMap())
	}

	const tableRecords = recordsStore.records
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
