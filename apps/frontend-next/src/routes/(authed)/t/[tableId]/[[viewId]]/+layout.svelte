<script lang="ts">
	import { page } from '$app/stores'
	import { setTable, setView } from '$lib/context'
	import CreateOption from '$lib/option/CreateOption.svelte'
	import { TableFactory } from '@undb/core'
	import { writable } from 'svelte/store'
	import type { LayoutServerData } from './$types'

	export let data: LayoutServerData

	const coreTable = TableFactory.fromQuery(data.table)
	const table = writable(coreTable)
	$: table.set(TableFactory.fromQuery(data.table))
	setTable(table)

	const view = writable($table.mustGetView($page.params.viewId))
	$: view.set($table.mustGetView($page.params.viewId))
	setView(view)
</script>

<div class="w-full h-full flex flex-col">
	<slot />
</div>

<CreateOption />
