<script lang="ts">
	import { page } from '$app/stores'
	import cx from 'classnames'
	import { Button } from 'flowbite-svelte'
	import type { IQueryTable } from '@undb/core'
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'
	import { t } from '$lib/i18n'

	export let value: string

	$: tables = $page.data.tables as IQueryTable[]
	$: selected = value ? tables.find((t) => t.id === value) : undefined
</script>

<Listbox class="relative" {value} on:change={(e) => (value = e.detail)}>
	<ListboxButton as="div" class="box-border">
		<Button color="alternative" {...$$restProps} class={cx($$restProps.class, 'gap-2')}>
			{#if selected}
				{selected.name}
			{:else}
				<span class="text-gray-400">{$t('Select Table')}</span>
			{/if}
		</Button>
	</ListboxButton>
	<ListboxOptions
		class="fixed bg-white py-1 border border-gray-100 shadow-lg overflow-y-auto min-w-[200px] mt-2 z-50 max-h-[300px]"
	>
		{#each tables as table (table.id)}
			<ListboxOption
				value={table.id}
				let:selected={selectedItem}
				class="p-2 cursor-pointer hover:bg-gray-100 text-gray-700 flex gap-2 justify-between"
			>
				<div class="inline-flex gap-2">
					{table.name}
				</div>
				{#if selectedItem}
					<i class="ti ti-check text-sm" />
				{/if}
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>
