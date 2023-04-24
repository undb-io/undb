<script lang="ts">
	import { getField, getTable, records } from '$lib/store/table'
	import TableIndex from '$lib/table/TableIndex.svelte'
	import { RecordFactory } from '@undb/core'
	import type { PageData } from './$types'
	import TableToolBar from '$lib/table/TableToolBar.svelte'
	import CreateRecord from '$lib/record/CreateRecord.svelte'
	import CreateField from '$lib/field/CreateField.svelte'
	import UpdateField from '$lib/field/UpdateField.svelte'

	const table = getTable()
	export let data: PageData

	records.set(RecordFactory.fromQueryRecords(data.records.records, $table.schema.toIdMap()))
	$: records.set(RecordFactory.fromQueryRecords(data.records.records, $table.schema.toIdMap()))

	const field = getField()
</script>

<TableToolBar />
<TableIndex />

<CreateRecord data={data.createRecord} />
<CreateField data={data.createField} />
{#if $field}
	{#key $field}
		<UpdateField field={$field} data={data.updateField} />
	{/key}
{/if}
