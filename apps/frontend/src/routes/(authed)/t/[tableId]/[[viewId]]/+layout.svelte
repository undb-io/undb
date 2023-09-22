<script lang="ts">
	import { currentTable } from '$lib/store/table'
	import TableNav from '$lib/table/TableNav.svelte'
	import TableToolBar from '$lib/table/TableToolBar.svelte'
</script>

<div class="w-full h-full flex flex-col">
	<TableNav />
	<TableToolBar />
	<slot />
</div>

<svelte:head>
	<title>{$currentTable.name.value}</title>
</svelte:head>
