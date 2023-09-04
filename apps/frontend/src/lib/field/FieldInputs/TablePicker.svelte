<script lang="ts">
	import cx from 'classnames'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import type { Table } from '@undb/core'
	import { t } from '$lib/i18n'
	import { allTables, tableById } from '$lib/store/table'

	export let value: string

	let selected: Table | undefined
	$: if (value) {
		$tableById(value).then((t) => (selected = t))
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="secondary" builders={[builder]} {...$$restProps} class={cx($$restProps.class, 'gap-2')}>
			{#if selected}
				{selected.name.value}
			{:else}
				<span class="text-gray-400">
					{$t('Select Table')}
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	{#if $allTables}
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.RadioGroup bind:value>
				{#each $allTables as table (table.id)}
					<DropdownMenu.RadioItem value={table.id}>
						<li class="w-full inline-flex gap-2 hover:bg-gray-100 cursor-pointer">
							<span
								class={cx(
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
