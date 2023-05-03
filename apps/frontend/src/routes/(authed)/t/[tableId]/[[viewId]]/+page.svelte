<script lang="ts">
	import { currentFieldId, currentRecord, currentRecordId, getField, getTable, records } from '$lib/store/table'
	import TableIndex from '$lib/table/TableIndex.svelte'
	import { RecordFactory } from '@undb/core'
	import type { PageData } from './$types'
	import CreateRecord from '$lib/record/CreateRecord.svelte'
	import CreateField from '$lib/field/CreateField.svelte'
	import UpdateField from '$lib/field/UpdateField.svelte'
	import UpdateRecord from '$lib/record/UpdateRecord.svelte'
	import CreateOption from '$lib/option/CreateOption.svelte'
	import CreateView from '$lib/view/CreateView.svelte'
	import ViewConfigModal from '$lib/view/ViewConfigModal.svelte'
	import UpdateTable from '$lib/table/UpdateTable.svelte'
	import { createTableOpen, createRecordOpen } from '$lib/store/modal'

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

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 't') {
			$createTableOpen = true
		} else if (event.key === 'r') {
			$createRecordOpen = true
		}
	}
</script>

<TableIndex />

<UpdateTable data={data.updateTable} />
<CreateView data={data.createView} />
<ViewConfigModal />
<CreateRecord data={data.createRecord} />
<CreateField data={data.createField} />
{#if $currentRecordId}
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

<svelte:window on:keydown|preventDefault={onKeydown} />
