<script lang="ts">
	import { getTable, listTreeRecordsFn } from '$lib/store/table'
	import { RecordFactory, type IQueryTreeRecord, type TreeField } from '@undb/core'
	import type { TreeRecord } from './tree-view.type'
	import TreeItem from './TreeItem.svelte'

	export let field: TreeField
	const table = getTable()

	$: schema = $table.schema.toIdMap()

	const data = $listTreeRecordsFn(field)

	const mapper = (record: IQueryTreeRecord): TreeRecord => {
		const r = RecordFactory.fromQuery(record, schema).unwrap()
		return {
			id: r.id.value,
			record: r,
			children: record.children?.map((r) => mapper(r)) ?? [],
		}
	}

	$: records = $data.data?.records.map(mapper) ?? []
	$: record = { id: '', record: null, children: records }
</script>

<div class="-ml-8">
	<TreeItem {record} {field} />
</div>
