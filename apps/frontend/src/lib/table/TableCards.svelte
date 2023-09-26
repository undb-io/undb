<script lang="ts">
	import * as Card from '$components/ui/card'
	import * as Tooltip from '$components/ui/tooltip'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'
	import { cn } from '$lib/utils'
	import type { IQueryTable } from '@undb/core'
	import { hasPermission } from '$lib/store/authz'

	export let tables: IQueryTable[] = []
</script>

<ul class="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
	{#each tables as table}
		<li>
			<a href={`/t/${table.id}`}>
				<Card.Root class="hover:shadow-lg transition">
					<Card.Header>
						<div class="flex items-center gap-3">
							<span
								class={cn(
									'text-gray-400 border-gray-200 group-hover:border-primary group-hover:text-primary',
									'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
								)}
							>
								{table.name.slice(0, 1)}
							</span>
							<Tooltip.Root openDelay={50}>
								<Tooltip.Trigger class="truncate">
									<h5 class="font-semibold truncate">{table.name}</h5>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>{table.name}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
					</Card.Header>
				</Card.Root>
			</a>
		</li>
	{/each}

	{#if $hasPermission('table:create')}
		<Card.Root
			class="!max-w-none cursor-pointer hover:bg-primary-500/90  hover:shadow-sm transition h-full border border-dashed border-slate-200 hover:border-slate-100"
			on:click={() => createTableModal.open()}
		>
			<Card.Header>
				<div class="flex items-center gap-2 h-full font-normal text-sm text-gray-500">
					<i class="ti ti-plus" />
					<p>{$t('Create New Table')}</p>
				</div>
			</Card.Header>
		</Card.Root>
	{/if}
</ul>
