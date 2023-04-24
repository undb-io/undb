<script lang="ts">
	import { page } from '$app/stores'
	import CreateOption from '$lib/option/CreateOption.svelte'
	import { TableFactory } from '@undb/core'
	import type { LayoutServerData } from './$types'
	import { goto } from '$app/navigation'
	import { currentTable, currentView } from '$lib/store/table'

	export let data: LayoutServerData

	if (!data.table) {
		goto('/', { replaceState: true })
	}

	const coreTable = TableFactory.fromQuery(data.table)
	$: data.table, currentTable.set(TableFactory.fromQuery(data.table))
	currentTable.set(coreTable)

	currentView.set(coreTable.mustGetView($page.params.viewId))
	$: currentView.set(coreTable.mustGetView($page.params.viewId))
</script>

<div class="w-full h-full flex flex-col">
	<slot />
</div>

<svelte:head>
	<title>{$currentTable.name.value}</title>
</svelte:head>
<CreateOption />
