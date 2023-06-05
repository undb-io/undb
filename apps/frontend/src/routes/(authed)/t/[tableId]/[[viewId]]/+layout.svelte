<script lang="ts">
	import { currentTable } from '$lib/store/table'
	import TableToolBar from '$lib/table/TableToolBar.svelte'
	import TableViewsTab from '$lib/table/TableViewsTab.svelte'
</script>

<div class="w-full h-full flex flex-col">
	<TableViewsTab />
	<TableToolBar />
	<slot />
</div>

<svelte:head>
	<title>{$currentTable.name.value}</title>
</svelte:head>
