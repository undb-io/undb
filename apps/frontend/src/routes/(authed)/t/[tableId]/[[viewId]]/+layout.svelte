<script lang="ts">
	import { currentTable } from '$lib/store/table'
	import TableNav from '$lib/table/TableNav.svelte'
	import TableToolBar from '$lib/table/TableToolBar.svelte'
	import TableViewsTab from '$lib/table/TableViewsTab.svelte'
</script>

<div class="w-full h-full flex flex-col">
	<TableNav />
	<TableViewsTab />
	<TableToolBar />
	<slot />
</div>

<svelte:head>
	<title>{$currentTable.name.value}</title>
</svelte:head>
