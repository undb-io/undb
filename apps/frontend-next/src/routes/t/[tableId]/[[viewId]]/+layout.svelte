<script lang="ts">
	import { page } from '$app/stores'
	import { setRecords, setTable, setView } from '$lib/context'
	import TableToolBar from '$lib/table/TableToolBar.svelte'
	import { RecordFactory, TableFactory } from '@undb/core'
	import { writable } from 'svelte/store'

	const coreTable = TableFactory.fromQuery($page.data.table)
	const table = writable(coreTable)
	$: table.set(TableFactory.fromQuery($page.data.table))
	setTable(table)

	const view = writable($table.mustGetView($page.params.viewId))
	$: view.set($table.mustGetView($page.params.viewId))
	setView(view)

	const records = writable(RecordFactory.fromQueryRecords($page.data.records, $table.schema.toIdMap()))
	$: records.set(RecordFactory.fromQueryRecords($page.data.records, $table.schema.toIdMap()))
	setRecords(records)
</script>

<div class="w-full h-full flex flex-col">
	<TableToolBar />
	<slot />
</div>
