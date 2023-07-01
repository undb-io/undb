<script lang="ts">
	import { allTablesExcludeCurren, getTable } from '$lib/store/table'
	import { Svelvet } from 'svelvet'
	import TableNode from './TableNode.svelte'

	const table = getTable()
</script>

<Svelvet minimap controls>
	<TableNode table={$table} />
	{#each $allTablesExcludeCurren as t}
		<TableNode table={t} />
	{/each}
</Svelvet>
