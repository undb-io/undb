<script lang="ts">
	import { RecordFactory, type ReferenceField, TableFactory, Record } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { getTable, recordsStore } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'

	export let value: string[] = []

	export let record: Record | undefined = undefined
	export let field: ReferenceField

	const table = getTable()
	$: foreignTableId = field.foreignTableId.unwrapOr($table.id.value)

	const tableRecords = recordsStore.records
	async function getForeignRecords(q?: string) {
		if ($table.id.value === foreignTableId) {
			return $tableRecords.filter((r) => !value.includes(r.id.value))
		} else {
			const { table: foreignTable } = await trpc().table.get.utils.fetch({ id: foreignTableId })
			if (foreignTable) {
				const ft = TableFactory.fromQuery(foreignTable)
				const data = await trpc().record.foreign.utils.fetch({
					tableId: $table.id.value,
					fieldId: field.id.value,
					foreignTableId,
					q,
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
			const { table: foreignTable } = await trpc().table.get.utils.fetch({ id: foreignTableId })
			if (foreignTable) {
				const ft = TableFactory.fromQuery(foreignTable)

				const data = await trpc().record.list.utils.fetch({
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
