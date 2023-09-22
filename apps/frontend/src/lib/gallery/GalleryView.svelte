<script lang="ts">
	import { getTable, listRecordFn, recordsStore } from '$lib/store/table'
	import { RecordFactory, type Field } from '@undb/core'
	import GalleryItem from './GalleryItem.svelte'
	import Empty from '$lib/table/Empty.svelte'

	const table = getTable()

	export let field: Field

	$: data = $listRecordFn()

	$: recordsStore.setAllRecords(RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap()))
	$: records = recordsStore.records
</script>

<main class="w-full h-full p-4 overflow-auto">
	{#if !$records.length}
		<Empty />
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 3xl:grid-cols-7 gap-4">
			{#each $records as record}
				<GalleryItem {field} {record} />
			{/each}
		</div>
	{/if}
</main>
