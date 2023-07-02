<script lang="ts">
	import cx from 'classnames'
	import { getFilterOperators } from '$lib/field/helpers'
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'
	import type { Field } from '@undb/core'
	import { Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'

	export let value: string = ''
	export let field: Field | undefined

	$: data = getFilterOperators(field?.type)
	$: if (!!field && !data.some((v) => v.value === value)) {
		value = data[0]?.value ?? ''
	}
</script>

<Listbox class="relative" {value} on:change={(e) => (value = e.detail)}>
	<ListboxButton as="div">
		<Button
			color="alternative"
			{...$$restProps}
			class={cx($$restProps.class, 'gap-2 text-gray-600 whitespace-nowrap text-xs')}
		>
			{#if value}
				{$t(value, { ns: 'common' })}
			{:else}
				<span class="text-gray-500 text-xs font-normal">{$t('is', { ns: 'common' })}...</span>
			{/if}
		</Button>
	</ListboxButton>
	<ListboxOptions
		class="fixed bg-white dark:bg-gray-700 py-1 dark:shadow-gray-500 shadow-sm rounded-md overflow-y-auto w-48 z-50"
	>
		{#each data as item}
			<ListboxOption
				value={item.value}
				class="p-2 cursor-pointer hover:bg-gray-100 text-xs text-gray-700 dark:text-white dark:hover:text-gray-700"
			>
				{$t(item.value, { ns: 'common' })}
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>
