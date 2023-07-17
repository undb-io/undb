<script lang="ts">
	import cx from 'classnames'
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import type { Table } from '@undb/core'
	import { t } from '$lib/i18n'
	import { allTables, tableById } from '$lib/store/table'

	export let value: string

	let selected: Table | undefined
	$: if (value) {
		$tableById(value).then((t) => (selected = t))
	}

	let open = false
</script>

<Button color="alternative" {...$$restProps} class={cx($$restProps.class, 'gap-2')} on:click={() => (open = true)}>
	{#if selected}
		{selected.name}
	{:else}
		<span class="text-gray-400">{$t('Select Table')}</span>
	{/if}
</Button>
{#if $allTables}
	<Dropdown bind:open class="z-[99999] w-96">
		{#each $allTables as table (table.id)}
			<Radio
				value={table.id}
				bind:group={value}
				class="px-2 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 flex gap-2 justify-between"
				custom
				on:change={() => (open = false)}
			>
				<li class="w-full p-2 inline-flex gap-2 hover:bg-gray-100 cursor-pointer">
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
				{#if selected?.id.value === table.id}
					<i class="ti ti-check text-sm" />
				{/if}
			</Radio>
		{/each}
	</Dropdown>
{/if}
