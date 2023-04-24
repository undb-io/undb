<script lang="ts">
	import { currentRecord, getField, getTable, records } from '$lib/store/table'
	import TableIndex from '$lib/table/TableIndex.svelte'
	import { RecordFactory } from '@undb/core'
	import type { PageData } from './$types'
	import TableToolBar from '$lib/table/TableToolBar.svelte'
	import CreateRecord from '$lib/record/CreateRecord.svelte'
	import CreateField from '$lib/field/CreateField.svelte'
	import UpdateField from '$lib/field/UpdateField.svelte'
	import UpdateRecord from '$lib/record/UpdateRecord.svelte'

	const table = getTable()
	export let data: PageData

	$: schema = $table.schema.toIdMap()

	$: records.set(RecordFactory.fromQueryRecords(data.records.records, schema))
	$: if (data.record) {
		currentRecord.set(RecordFactory.fromQuery(data.record, schema).unwrap())
	}

	const field = getField()
</script>

<TableToolBar />
<TableIndex />

<CreateRecord data={data.createRecord} />
<CreateField data={data.createField} />
<UpdateRecord data={data.updateRecord} />
{#if $field}
	{#key $field}
		<UpdateField field={$field} data={data.updateField} />
	{/key}
{/if}
