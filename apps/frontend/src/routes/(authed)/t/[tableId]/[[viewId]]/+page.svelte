<script lang="ts">
	import { currentFieldId, currentRecord, currentRecordId, getField, getTable } from '$lib/store/table'
	import TableIndex from '$lib/table/TableIndex.svelte'
	import { RecordFactory } from '@undb/core'
	import type { PageData } from './$types'
	import CreateRecord from '$lib/record/CreateRecord.svelte'
	import CreateField from '$lib/field/CreateField.svelte'
	import UpdateField from '$lib/field/UpdateField.svelte'
	import UpdateRecord from '$lib/record/UpdateRecord.svelte'
	import CreateOption from '$lib/option/CreateOption.svelte'
	import ViewConfigModal from '$lib/view/ViewConfigModal.svelte'
	import UpdateTable from '$lib/table/UpdateTable.svelte'
	import { createRecordModal, createTableModal, erdModal } from '$lib/store/modal'
	import UpdateOption from '$lib/option/UpdateOption.svelte'
	import VisualizationModal from '$lib/visualization/VisualizationModal.svelte'
	import DuplicateField from '$lib/field/DuplicateField.svelte'
	import WebhookListModal from '$lib/webhook/WebhookListModal.svelte'
	import ErdModal from '$lib/erd/ErdModal.svelte'
	import FormListDrawer from '$lib/form/FormListDrawer.svelte'
	import FormEditorModal from '$lib/form/FormEditorModal.svelte'

	const table = getTable()
	export let data: PageData

	$: schema = $table.schema.toIdMap()

	$: if (data.record) {
		currentRecord.set(RecordFactory.fromQuery(data.record, schema).unwrap())
	}
	$: if (!$currentRecordId) {
		currentRecord.set(undefined)
	}

	const field = getField()

	const onKeydown = (event: KeyboardEvent) => {
		const type = (event.target as any)?.type
		if (type === 'search' || type === 'text') return
		if (event.key === 't' && !(event.ctrlKey || event.altKey || event.metaKey)) {
			createTableModal.open()
		} else if (event.key === 'r' && !(event.ctrlKey || event.altKey || event.metaKey)) {
			createRecordModal.open()
		}
	}
</script>

<TableIndex />

{#key $table}
	<UpdateTable data={data.updateTable} />
{/key}
<ViewConfigModal />
<CreateRecord data={data.createRecord} />
<CreateField data={data.createField} />
<WebhookListModal />
<FormListDrawer />
<FormEditorModal />
{#if $erdModal.open}
	<ErdModal />
{/if}
{#if $currentRecordId}
	<UpdateRecord data={data.updateRecord} />
{/if}
{#if $currentFieldId}
	<CreateOption data={data.createOption} />
{/if}
<UpdateOption data={data.updateOption} />
{#if $field}
	{#key $field}
		<UpdateField field={$field} data={data.updateField} />
	{/key}
{/if}
{#if $field}
	{#key $field}
		<DuplicateField field={$field} />
	{/key}
{/if}

<VisualizationModal />

<svelte:window on:keydown={onKeydown} />
