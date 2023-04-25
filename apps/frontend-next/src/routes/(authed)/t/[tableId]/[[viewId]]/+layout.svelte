<script lang="ts">
	import { page } from '$app/stores'
	import { TableFactory } from '@undb/core'
	import type { LayoutServerData } from './$types'
	import { goto } from '$app/navigation'
	import { currentTable, currentView } from '$lib/store/table'
	import TableToolBar from '$lib/table/TableToolBar.svelte'

	export let data: LayoutServerData

	if (!data.table) {
		goto('/', { replaceState: true })
	}

	$: data.table, currentTable.set(TableFactory.fromQuery(data.table))

	$: currentView.set($currentTable.mustGetView($page.params.viewId))
</script>

<div class="w-full h-full flex flex-col">
	<TableToolBar />
	<slot />
</div>

<svelte:head>
	<title>{$currentTable.name.value}</title>
</svelte:head>
