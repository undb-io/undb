<script lang="ts">
	import { page } from '$app/stores'
	import { TableFactory } from '@undb/core'
	import type { LayoutData } from './$types'
	import { goto } from '$app/navigation'
	import { currentTable, currentView } from '$lib/store/table'
	import TableToolBar from '$lib/table/TableToolBar.svelte'
	import TableViewsTab from '$lib/table/TableViewsTab.svelte'

	export let data: LayoutData

	$: if (!data.table) {
		goto('/', { replaceState: true })
	}

	$: if (data.table) {
		currentTable.set(TableFactory.fromQuery(data.table))
		currentView.set($currentTable.mustGetView($page.params.viewId))
	}
</script>

<div class="w-full h-full flex flex-col">
	<TableViewsTab />
	<TableToolBar />
	<slot />
</div>

<svelte:head>
	<title>{$currentTable.name.value}</title>
</svelte:head>
