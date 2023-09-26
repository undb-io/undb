<script lang="ts">
	import type { IQueryBase, IQueryTable } from '@undb/core'
	import { page } from '$app/stores'
	import TablesNavItem from './TablesNavItem.svelte'
	import * as Accordion from '$lib/components/ui/accordion'
	import { createTableDefaultValue, currentBaseId } from '$lib/store/table'
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'

	export let tables: IQueryTable[]
	export let bases: IQueryBase[]

	const EMPTY_ID = '__empty'

	$: noBaseTables = tables.filter((t) => !t.baseId)
</script>

<ul class="-mx-2 space-y-1 pb-2">
	<Accordion.Root value={$currentBaseId || EMPTY_ID}>
		{#each bases as base (base.id)}
			<Accordion.Item value={base.id} class="border-0">
				<Accordion.Trigger class="hover:no-underline hover:bg-gray-100 px-3 py-2 border-0">
					<div class="text-sm text-gray-900 font-light flex items-center gap-2">
						<i class="ti ti-database"></i>
						<span>
							{base.name}
						</span>
					</div>
				</Accordion.Trigger>
				<Accordion.Content class="border-0">
					{@const baseTables = tables.filter((t) => t.baseId === base.id)}
					{#if baseTables.length}
						{#each baseTables as table}
							{@const active = table.id === $page.params.tableId}
							<TablesNavItem {active} {table} />
						{/each}
					{:else}
						<div class="w-full py-3">
							<Button
								size="sm"
								variant="outline"
								class="w-full"
								on:click={() => {
									createTableDefaultValue.set({
										baseId: base.id,
									})
									createTableModal.open()
								}}>{$t('Create New Table')}</Button
							>
						</div>
					{/if}
				</Accordion.Content>
			</Accordion.Item>
		{/each}
		{#if noBaseTables.length}
			<Accordion.Item value={EMPTY_ID} class="border-0">
				<Accordion.Trigger class="hover:no-underline hover:bg-gray-100 px-3 py-2 border-0">
					<div class="text-sm text-gray-900 font-light">
						{$t('Empty Base', { ns: 'base' })}
					</div>
				</Accordion.Trigger>
				<Accordion.Content class="border-0">
					{#each noBaseTables as table}
						{@const active = table.id === $page.params.tableId}
						<TablesNavItem {active} {table} />
					{/each}
				</Accordion.Content>
			</Accordion.Item>
		{/if}
	</Accordion.Root>
</ul>
