<script lang="ts">
	import { RecordFactory, type IGroup, type Records, type ReferenceField, TableFactory, Record } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { getRecords, getTable } from '$lib/store/table'
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'

	export let value: string[] = []

	export let record: Record | undefined = undefined
	export let field: ReferenceField

	const table = getTable()
	$: foreignTableId = field.foreignTableId.unwrapOr($table.id.value)

	const tableRecords = getRecords()
	async function getForeignRecords() {
		if ($table.id.value === foreignTableId) {
			return $tableRecords.filter((r) => !value.includes(r.id.value))
		} else {
			const foreignTable = await trpc($page).table.get.query({ id: foreignTableId })
			if (foreignTable) {
				const ft = TableFactory.fromQuery(foreignTable)
				const data = await trpc($page).record.foreign.query({
					tableId: $table.id.value,
					fieldId: field.id.value,
					foreignTableId,
					filter: [{ type: 'id', path: 'id', operator: '$nin', value: value ?? [] }],
				})

				return RecordFactory.fromQueryRecords(data.records, ft.schema.toIdMap())
			}
			return []
		}
	}

	async function getInitRecords() {
		if ($table.id.value === foreignTableId) {
			return $tableRecords.filter((r) => value.includes(r.id.value))
		} else {
			if (!value?.length) return []
			const foreignTable = await trpc($page).table.get.query({ id: foreignTableId })
			if (foreignTable) {
				const ft = TableFactory.fromQuery(foreignTable)

				const data = await trpc($page).record.list.query({
					tableId: foreignTableId,
					filter: [{ type: 'id', path: 'id', operator: '$in', value: value ?? [] }],
				})

				return RecordFactory.fromQueryRecords(data.records, ft.schema.toIdMap())
			}
			return []
		}
	}
</script>

<ForeignRecordsPicker
	{record}
	{field}
	{getForeignRecords}
	{getInitRecords}
	bind:value
	{foreignTableId}
	{...$$restProps}
/>
