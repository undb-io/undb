<script lang="ts">
	import { ParentField, RecordFactory, TreeField } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { getTable } from '$lib/context'
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'

	export let value: string
	export let field: ParentField

	const table = getTable()

	async function getForeignRecords() {
		const data = await trpc($page).record.parent.available.query({
			tableId: $table.id.value,
			parentFieldId: field.id.value,
		})

		return RecordFactory.fromQueryRecords(data.records, $table.schema.toIdMap())
	}

	let group: string[] = []

	$: value = group[0] ?? null
</script>

<ForeignRecordsPicker {getForeignRecords} bind:value={group} foreignTableId={$table.id.value} {...$$restProps} />
