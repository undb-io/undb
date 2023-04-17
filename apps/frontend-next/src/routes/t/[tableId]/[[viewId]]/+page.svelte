<script lang="ts">
	import type { PageData } from './$types'
	import Table from '$lib/table/table.svelte'
	import { writable } from 'svelte/store'
	import { RecordFactory, TableFactory, type Records } from '@undb/core'
	import { setTable, setView } from '$lib/context'
	import { page } from '$app/stores'

	export let data: PageData

	const coreTable = TableFactory.fromQuery(data.table)
	const table = writable(coreTable)
	$: table.set(TableFactory.fromQuery(data.table))
	setTable(table)

	const view = writable(coreTable.mustGetView($page.params.viewId))
	$: view.set(coreTable.mustGetView($page.params.viewId))
	setView(view)

	let records: Records = []
	$: records = RecordFactory.fromQueryRecords(data.records, $table.schema.toIdMap())
</script>

<Table {records} />
