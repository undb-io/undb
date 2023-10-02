<script lang="ts">
	import { cn } from '$lib/utils'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import type { IQueryTable, Table } from '@undb/core'
	import { t } from '$lib/i18n'
	import { allTables } from '$lib/store/table'
	import Label from '$components/ui/label/label.svelte'
	import { tableById } from '$lib/store/table'
	import Badge from '$components/ui/badge/badge.svelte'
	import * as HoverCard from '$lib/components/ui/hover-card'

	export let value: string[] | undefined

	export let filter: (table: IQueryTable) => boolean = () => true
	$: tables = $allTables?.filter(filter)
	let selected: Table[] | undefined

	async function getTables() {
		selected = (await Promise.all((value ?? []).map((tableId) => $tableById(tableId)))).filter(Boolean) as Table[]
	}
	$: if (value) {
		getTables()
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]} {...$$restProps} class={cn($$restProps.class, 'gap-2')}>
			{#if selected?.length}
				<ul class="flex flex-nowrap overflow-hidden gap-2">
					{#each selected.slice(0, 1) as item}
						<div class="inline-flex items-center gap-2">
							<span
								class={cn(
									'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
									'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
								)}
							>
								{item.name.value.slice(0, 1)}
							</span>

							{item.name.value}

							{#if selected.length > 1}
								<HoverCard.Root openDelay={100}>
									<HoverCard.Trigger>
										<Badge variant="outline">{$t('and n more', { n: selected.length - 1, ns: 'common' })}</Badge>
									</HoverCard.Trigger>
									<HoverCard.Content class="p-0">
										<ul class="p-1.5">
											{#each selected.slice(1) as t}
												<li class="w-full hover:bg-gray-100 p-1 transition text-sm">
													<span>
														{t.name.value}
													</span>
												</li>
											{/each}
										</ul>
									</HoverCard.Content>
								</HoverCard.Root>
							{/if}
						</div>
					{/each}
				</ul>
			{:else}
				<div class="flex items-center gap-2 text-gray-500 font-normal">
					<i class="ti ti-table"></i>
					<span>
						{$t('Select Table')}
					</span>
				</div>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	{#if tables}
		<DropdownMenu.Content class="w-72 max-h-72 overflow-auto">
			{#each tables as table (table.id)}
				{@const isSelected = value?.includes(table.id)}
				<DropdownMenu.Item
					on:click={(e) => {
						e.preventDefault()
					}}
				>
					<Label class="w-full flex items-center justify-between gap-2 hover:bg-gray-100 cursor-pointer">
						<div class="inline-flex items-center gap-2">
							<input type="checkbox" bind:group={value} value={table.id} class="hidden" />
							<span
								class={cn(
									'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
									'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
								)}
							>
								{table.name.slice(0, 1)}
							</span>

							{table.name}
						</div>
						{#if isSelected}
							<i class="ti ti-check"></i>
						{/if}
					</Label>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	{/if}
</DropdownMenu.Root>
