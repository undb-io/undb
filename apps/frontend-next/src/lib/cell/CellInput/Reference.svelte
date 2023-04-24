<script lang="ts">
	import { RecordFactory, type Records, type ReferenceField } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { getRecords, getTable } from '$lib/store/table'
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'

	export let value: string[] = []
	export let field: ReferenceField

	const table = getTable()
	$: foreignTableId = field.foreignTableId.unwrapOr($table.id.value)

	const tableRecords = getRecords()
	async function getForeignRecords() {
		if ($table.id.value === foreignTableId) {
			return $tableRecords.filter((r) => !value.includes(r.id.value))
		} else {
			const data = await trpc($page).record.foreign.query({
				tableId: $table.id.value,
				fieldId: field.id.value,
				foreignTableId,
				filter: [{ type: 'id', path: 'id', operator: '$nin', value: value ?? [] }],
			})

			return RecordFactory.fromQueryRecords(data.records, $table.schema.toIdMap())
		}
	}
</script>

<ForeignRecordsPicker {getForeignRecords} bind:value {foreignTableId} {...$$restProps} />
