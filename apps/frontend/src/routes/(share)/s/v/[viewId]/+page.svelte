<script lang="ts">
	import TableIndex from '$lib/table/TableIndex.svelte'
	import logo from '$lib/assets/logo.svg'
	import { Heading, P } from 'flowbite-svelte'
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
	<nav class="py-3 px-4 border-b">
		<div class="flex items-center gap-2">
			<img class="h-6 w-auto" src={logo} alt="undb" />
			<P size="lg" class="font-semibold select-none !text-blue-600">undb</P>

			<Heading tag="h6" class="ml-2">{$table.name.value}</Heading>
		</div>
	</nav>
	<main class="flex-1">
		<TableIndex />
	</main>
</div>
