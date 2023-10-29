<script lang="ts">
	import * as Card from '$components/ui/card'
	import * as Tooltip from '$components/ui/tooltip'
	import { t } from '$lib/i18n'
	import { cn } from '$lib/utils'
	import type { IQueryTable } from '@undb/core'
	import { Input } from '$components/ui/input'

	export let tables: IQueryTable[] = []

	let q = ''

	// TODO: use table name specification
	$: filteredTables = tables.filter((table) => (q ? table.name.toLowerCase().includes(q.toLocaleLowerCase()) : true))
</script>

<div class="space-y-3">
	<Input bind:value={q} placeholder={$t('search table')} />
	<ul class="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
		{#each filteredTables as table}
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

		<slot />
	</ul>
</div>
