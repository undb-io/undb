<script lang="ts">
	import { getTable } from '$lib/store/table'
	import TableViewTabItem from './TableViewTabItem.svelte'

	const table = getTable()

	$: views = $table.views.views ?? []
</script>

<section class="w-full mx-auto bg-gradient-to-r bg-white dark:bg-gray-900 border-b">
	<ul class="flex flex-wrap space-x-2">
		{#each views as view}
			<TableViewTabItem {view} />
		{/each}
	</ul>
</section>
