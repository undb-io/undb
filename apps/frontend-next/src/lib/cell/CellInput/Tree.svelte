<script lang="ts">
	import { RecordFactory, TreeField } from '@undb/core'
	import ForeignRecordsPicker from './ForeignRecordsPicker.svelte'
	import { getTable } from '$lib/store/table'
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'

	export let value: string[] = []
	export let field: TreeField

	const table = getTable()

	async function getForeignRecords() {
		const data = await trpc($page).record.tree.available.query({
			tableId: $table.id.value,
			treeFieldId: field.id.value,
		})

		return RecordFactory.fromQueryRecords(data.records, $table.schema.toIdMap())
	}
</script>

<ForeignRecordsPicker {getForeignRecords} bind:value foreignTableId={$table.id.value} {...$$restProps} />
