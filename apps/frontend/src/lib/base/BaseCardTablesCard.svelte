<script lang="ts">
	import * as HoverCard from '$lib/components/ui/hover-card'
	import CreateTableButton from '$lib/table/CreateTableButton.svelte'
	import { t } from '$lib/i18n'
	import { baseTables } from '$lib/store/table'
	import { cn } from '$lib/utils'
	import type { IQueryBase } from '@undb/core'

	export let base: IQueryBase

	$: tables = $baseTables(base.id) ?? []
</script>

<HoverCard.Root positioning={{ placement: 'bottom-start' }} openDelay={100}>
	<HoverCard.Trigger>
		<span class="text-xs text-gray-400">
			<i class="ti ti-table"></i>
			{$t('n tables', { ns: 'base', n: tables.length })}
		</span>
	</HoverCard.Trigger>
	<HoverCard.Content class="py-2 px-1.5">
		{#if tables.length}
			{#each tables as table}
				<a
					href={`/t/${table.id}`}
					class="flex items-center gap-2 rounded-sm text-sm p-1.5 hover:bg-gray-100 text-gray-600"
				>
					<span
						class={cn(
							'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
							'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
						)}
					>
						{table.name.slice(0, 1)}
					</span>
					{table.name}
				</a>
			{/each}
		{:else}
			<CreateTableButton class="w-full" variant="outline" />
		{/if}
	</HoverCard.Content>
</HoverCard.Root>
