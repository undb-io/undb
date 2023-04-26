<script lang="ts">
	import {
		currentFieldId,
		currentRecord,
		currentRecordId,
		getField,
		getRecord,
		getTable,
		records,
	} from '$lib/store/table'
	import TableIndex from '$lib/table/TableIndex.svelte'
	import { RecordFactory } from '@undb/core'
	import type { PageData } from './$types'
	import CreateRecord from '$lib/record/CreateRecord.svelte'
	import CreateField from '$lib/field/CreateField.svelte'
	import UpdateField from '$lib/field/UpdateField.svelte'
	import UpdateRecord from '$lib/record/UpdateRecord.svelte'
	import CreateOption from '$lib/option/CreateOption.svelte'

	const table = getTable()
	export let data: PageData

	$: schema = $table.schema.toIdMap()

	$: records.set(RecordFactory.fromQueryRecords(data.records.records, schema))
	$: if (data.record) {
		currentRecord.set(RecordFactory.fromQuery(data.record, schema).unwrap())
	}
	$: if (!$currentRecordId) {
		currentRecord.set(undefined)
	}

	const field = getField()
</script>

<TableIndex />

<CreateRecord data={data.createRecord} />
<CreateField data={data.createField} />
{#if $currentRecord}
	<UpdateRecord data={data.updateRecord} />
{/if}
{#if $currentFieldId}
	<CreateOption data={data.createOption} />
{/if}
{#if $field}
	{#key $field}
		<UpdateField field={$field} data={data.updateField} />
	{/key}
{/if}
