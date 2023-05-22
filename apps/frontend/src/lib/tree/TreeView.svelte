<script lang="ts">
	import { getTable, recordHash } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { RecordFactory, type IQueryTreeRecord, type TreeField, Record } from '@undb/core'
	import type { TreeRecord } from './tree-view.type'
	import TreeItem from './TreeItem.svelte'

	export let field: TreeField
	const table = getTable()

	$: schema = $table.schema.toIdMap()

	const data = trpc().record.tree.list.query(
		{
			tableId: $table.id.value,
			fieldId: field.id.value,
		},
		{
			queryHash: $recordHash,
		},
	)

	const mapper = (record: IQueryTreeRecord): TreeRecord => {
		const r = RecordFactory.fromQuery(record, schema).unwrap()
		return {
			id: r.id.value,
			record: r,
			children: record.children.map((r) => mapper(r)),
		}
	}

	$: records = $data.data?.records.map(mapper) ?? []
	$: record = { id: '', record: null, children: records }
</script>

<div class="-ml-6">
	<TreeItem {record} {field} />
</div>
