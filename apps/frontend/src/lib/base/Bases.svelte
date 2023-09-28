<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import * as Tooltip from '$components/ui/tooltip'
	import { t } from '$lib/i18n'
	import { createBaseModal } from '$lib/store/modal'
	import { firstTableOfBase } from '$lib/store/table'
	import type { IQueryBase } from '@undb/core'
	import BaseCardTablesCard from './BaseCardTablesCard.svelte'

	export let bases: IQueryBase[] = []

	const getHref = (base: IQueryBase) => {
		const table = $firstTableOfBase(base.id)
		if (table) return `/t/${table.id}`
		return `/bases/${base.id}`
	}
</script>

<ul class="grid grid-cols-4 gap-3">
	{#each bases as base}
		<a
			href={getHref(base)}
			class="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&:focus:not(:focus-visible)]:outline-none focus-visible:ring-indigo-600 rounded-md p-4 bg-white border border-solid border-slate-200 hover:border-slate-100 hover:shadow-md transition h-20 flex items-center justify-between group"
		>
			<div>
				<h6 class="antialiased font-bold text-slate-800 text-[1rem] flex items-center gap-2">
					<i class="ti ti-database"></i>
					<span>
						{base.name}
					</span>
				</h6>

				<BaseCardTablesCard {base} />
			</div>

			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button
						variant="ghost"
						size="icon"
						href={`/bases/${base.id}`}
						class="text-gray-500 flex opacity-0 group-hover:opacity-100 items-center transition"
					>
						<i class="ti ti-settings"></i>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content
					class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
				>
					{$t('base settings', { ns: 'base' })}
				</Tooltip.Content>
			</Tooltip.Root>
		</a>
	{/each}

	<button
		class="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&:focus:not(:focus-visible)]:outline-none focus-visible:ring-indigo-600 rounded-md border border-dashed border-slate-200 hover:border-slate-100 py-10 px-4 antialiased font-sans font-medium text-sm text-slate-600 leading-6 hover:text-slate-700 flex items-center justify-center gap-2 h-20"
		on:click={() => createBaseModal.open()}
	>
		<i class="ti ti-plus"></i>

		<span>
			{$t('Create New Base', { ns: 'base' })}
		</span>
	</button>
</ul>
