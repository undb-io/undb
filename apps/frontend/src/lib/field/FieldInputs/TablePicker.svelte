<script lang="ts">
	import { cn } from '$lib/utils'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import type { Table } from '@undb/core'
	import { t } from '$lib/i18n'
	import { allTables, tableById } from '$lib/store/table'

	export let value: string | undefined

	let selected: Table | undefined
	$: if (value) {
		$tableById(value).then((t) => (selected = t))
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]} {...$$restProps} class={cn($$restProps.class, 'gap-2')}>
			{#if selected}
				<div class="inline-flex items-center gap-2">
					<span
						class={cn(
							'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
							'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
						)}
					>
						{selected.name.value.slice(0, 1)}
					</span>

					{selected.name.value}
				</div>
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
	{#if $allTables}
		<DropdownMenu.Content class="w-72 max-h-72 overflow-auto">
			<DropdownMenu.RadioGroup bind:value>
				{#each $allTables as table (table.id)}
					<DropdownMenu.RadioItem value={table.id}>
						<li class="w-full inline-flex gap-2 hover:bg-gray-100 cursor-pointer">
							<span
								class={cn(
									'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
									'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
								)}
							>
								{table.name.slice(0, 1)}
							</span>

							{table.name}
						</li>
					</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	{/if}
</DropdownMenu.Root>
