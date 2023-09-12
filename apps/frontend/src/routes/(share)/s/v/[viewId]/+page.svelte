<script lang="ts">
	import TableIndex from '$lib/table/TableIndex.svelte'
	import logo from '$lib/assets/logo.svg'
	import { currentRecord, currentRecordId, getTable } from '$lib/store/table'
	import { page } from '$app/stores'
	import { RecordFactory } from '@undb/core'

	const table = getTable()
	$: schema = $table.schema.toIdMap()

	$: if ($page.data.record) {
		currentRecord.set(RecordFactory.fromQuery($page.data.record, schema).unwrap())
	}
	$: if (!$currentRecordId) {
		currentRecord.set(undefined)
	}
</script>

<div class="flex flex-col h-screen">
	<nav class="py-3 px-4 border-b flex items-center gap-2">
		<a target="_blank" href="https://www.undb.xyz" class="flex items-center gap-2">
			<img class="h-6 w-auto" src={logo} alt="undb" />
			<p class="text-lg font-semibold select-none !text-primary-600">undb</p>
		</a>
		<h4 class="ml-2 font-bold text-lg">{$table.name.value}</h4>
	</nav>
	<main class="flex-1">
		<TableIndex />
	</main>
</div>
