<script lang="ts">
	import { allTablesExcludeCurren, getTable } from '$lib/store/table'
	import { Svelvet } from 'svelvet'
	import TableNode from './TableNode.svelte'

	const table = getTable()
</script>

<Svelvet minimap controls>
	<TableNode table={$table} position={{ x: 0, y: 0 }} zIndex={100} />
	{#each $allTablesExcludeCurren as t, index}
		{@const position = { x: ((index + 1) % 5) * 400, y: ((index + 1) / 5) * 400 }}
		<TableNode table={t} zIndex={1} {position} />
	{/each}
</Svelvet>
