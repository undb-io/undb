<script lang="ts">
	import { getTable, listRecordFn } from '$lib/store/table'
	import { RecordFactory, type Field } from '@undb/core'
	import GalleryItem from './GalleryItem.svelte'

	const table = getTable()

	export let field: Field

	$: data = $listRecordFn()

	$: records = RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap())
</script>

<main class="w-full h-full p-4 overflow-auto">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each records as record}
			<GalleryItem {field} {record} />
		{/each}
	</div>
</main>
