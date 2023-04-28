<script lang="ts">
	import cx from 'classnames'
	import { getFilterOperators } from '$lib/field/helpers'
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'
	import type { Field } from '@undb/core'
	import { Button } from 'flowbite-svelte'

	export let value: string = ''
	export let field: Field | undefined

	$: data = getFilterOperators(field?.type)
</script>

<Listbox class="relative" {value} on:change={(e) => (value = e.detail)}>
	<ListboxButton as="div">
		<Button color="alternative" {...$$restProps} class={cx($$restProps.class, 'gap-2 text-gray-600')}>
			{#if value}
				{value}
			{:else}
				<span class="text-gray-400 text-sm">is...</span>
			{/if}
		</Button>
	</ListboxButton>
	<ListboxOptions class="absolute bg-white py-1 border border-gray-100 shadow-md overflow-y-auto w-48 z-50">
		{#each data as item}
			<ListboxOption value={item.value} class="p-2 cursor-pointer hover:bg-gray-100 text-xs text-gray-500">
				{item.name}
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>
