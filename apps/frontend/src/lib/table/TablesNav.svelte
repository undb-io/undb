<script lang="ts">
	import type { IQueryBase, IQueryTable } from '@undb/core'
	import { page } from '$app/stores'
	import TablesNavItem from './TablesNavItem.svelte'
	import * as Accordion from '$lib/components/ui/accordion'
	import { currentBaseId } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { cn } from '$lib/utils'
	import { goto } from '$app/navigation'
	import CreateTableButton from './CreateTableButton.svelte'

	export let tables: IQueryTable[]
	export let bases: IQueryBase[]

	const EMPTY_ID = '__empty'

	$: noBaseTables = tables.filter((t) => !t.baseId)
</script>

<ul class="-mx-2 space-y-1 pb-2">
	<Accordion.Root value={$currentBaseId || EMPTY_ID}>
		{#each bases as base (base.id)}
			<Accordion.Item
				value={base.id}
				class={cn('border-0 group/base', $currentBaseId === base.id && 'bg-slate-50 dark:bg-gray-500 rounded-lg')}
			>
				<Accordion.Trigger
					class="hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-3 py-2 border-0 w-full"
				>
					<div class=" text-gray-900 dark:text-gray-50 flex items-center justify-between gap-2 w-full pr-2">
						<div class="flex items-center gap-2">
							<i class="ti ti-database"></i>
							<span>
								{base.name}
							</span>
						</div>

						<button
							on:click={(e) => {
								e.stopPropagation()
								goto(`/bases/${base.id}`)
							}}
							class={cn(
								'opacity-0 group-hover/base:opacity-100 transition',
								$currentBaseId === base.id && 'opacity-100',
							)}
						>
							<i class="ti ti-settings text-gray-500"></i>
						</button>
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
					<CreateTableButton
						size="default"
						variant="ghost"
						class={cn(
							'w-full gap-2 py-1 text-slate-500 justify-start hover:text-primary dark:hover:bg-gray-600 dark:hover:text-primary',
						)}
					/>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
		{#if noBaseTables.length}
			<Accordion.Item
				value={EMPTY_ID}
				class={cn('border-0', $currentBaseId === EMPTY_ID || (!$currentBaseId && 'bg-slate-50'))}
			>
				<Accordion.Trigger
					class="hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-3 py-2 border-0"
				>
					<div class="flex items-center gap-2 font-light">
						<i class="ti ti-align-box-bottom-left"></i>
						<span>
							{$t('Empty Base', { ns: 'base' })}
						</span>
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
