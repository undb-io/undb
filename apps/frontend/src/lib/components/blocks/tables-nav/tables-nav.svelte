<script lang="ts">
	import { page } from '$app/stores';
	import type { ITableDTO } from '@undb/table';
	import { Database } from 'lucide-svelte';

	export let tables: ITableDTO[];
</script>

<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
	{#each tables as table}
		<a
			href={`/t/${table.id}`}
			data-active={table.id === $page.params.tableId}
			class="text-muted-foreground hover:text-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
		>
			<Database class="h-4 w-4" />
			{table.name}
			<!-- <Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
				6
			</Badge> -->
		</a>
	{/each}
</nav>
