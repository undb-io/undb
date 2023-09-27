<script lang="ts">
	import type { IQueryBase, IQueryTable } from '@undb/core'
	import { page } from '$app/stores'
	import TablesNavItem from './TablesNavItem.svelte'
	import * as Accordion from '$lib/components/ui/accordion'
	import { createTableDefaultValue, currentBaseId } from '$lib/store/table'
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'
	import { cn } from '$lib/utils'

	export let tables: IQueryTable[]
	export let bases: IQueryBase[]

	const EMPTY_ID = '__empty'

	$: noBaseTables = tables.filter((t) => !t.baseId)
</script>

<ul class="-mx-2 space-y-1 pb-2">
	<Accordion.Root value={$currentBaseId || EMPTY_ID}>
		{#each bases as base (base.id)}
			<Accordion.Item value={base.id} class={cn('border-0', $currentBaseId === base.id && 'bg-slate-50')}>
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
					{/if}
					<Button
						size="sm"
						variant={baseTables.length ? 'ghost' : 'outline'}
						class={cn('w-full gap-2 py-1', baseTables.length ? 'text-slate-500 justify-start' : 'my-3')}
						on:click={() => {
							createTableDefaultValue.set({
								baseId: base.id,
							})
							createTableModal.open()
						}}
					>
						<i class="ti ti-plus"></i>
						<span>
							{$t('Create New Table')}
						</span>
					</Button>
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
