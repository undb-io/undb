<script lang="ts">
	import { getTable, setRecords } from '$lib/context'
	import TableIndex from '$lib/table/TableIndex.svelte'
	import { RecordFactory } from '@undb/core'
	import { writable } from 'svelte/store'
	import type { PageData } from './$types'
	import TableToolBar from '$lib/table/TableToolBar.svelte'

	const table = getTable()
	export let data: PageData

	const records = writable(RecordFactory.fromQueryRecords(data.records.records, $table.schema.toIdMap()))
	$: records.set(RecordFactory.fromQueryRecords(data.records.records, $table.schema.toIdMap()))
	setRecords(records)
</script>

<TableToolBar />
<TableIndex />
