<script lang="ts">
	import type { IQueryBase, IQueryTable } from '@undb/core'
	import { page } from '$app/stores'
	import TablesNavItem from './TablesNavItem.svelte'
	import * as Accordion from '$lib/components/ui/accordion'
	import { currentBaseId } from '$lib/store/table'

	export let tables: IQueryTable[]
	export let bases: IQueryBase[]

	$: noBaseTables = tables.filter((t) => !t.baseId)
</script>

<ul class="-mx-2 space-y-1 pb-2">
	<Accordion.Root>
		{#each bases as base (base.id)}
			<Accordion.Item value={base.id}>
				<Accordion.Trigger class="hover:no-underline hover:bg-gray-100 px-2 py-2">
					<div class="text-sm text-gray-500 font-light">{base.name}</div>
				</Accordion.Trigger>
				<Accordion.Content>
					{@const baseTables = tables.filter((t) => t.baseId === base.id)}
					{#each baseTables as table}
						{@const active = table.id === $page.params.tableId}
						<TablesNavItem {active} {table} />
					{/each}
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>

	{#each noBaseTables as table}
		{@const active = table.id === $page.params.tableId}
		<TablesNavItem {active} {table} />
	{/each}
</ul>
