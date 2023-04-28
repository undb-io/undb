<script lang="ts">
	import cx from 'classnames'
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'
	import type { Field, IFieldType, Table } from '@undb/core'
	import { Button } from 'flowbite-svelte'
	import { identity } from 'lodash-es'
	import FieldIcon from '../FieldIcon.svelte'
	import { t } from '$lib/i18n'

	export let value: string = ''
	export let table: Table
	export let filter: (field: Field) => boolean = identity

	export let selected: Field | undefined = undefined
	export let type: IFieldType | undefined = undefined

	$: fields = table.schema.fields.filter(filter)

	$: selected = value ? table.schema.fields.find((f) => f.id.value === value) : undefined
	$: type = selected?.type
</script>

<Listbox
	class="relative"
	{value}
	on:change={(e) => {
		value = e.detail
	}}
>
	<ListboxButton as="div" class="box-border">
		<Button color="alternative" {...$$restProps} class={cx($$restProps.class, 'gap-2')}>
			{#if selected}
				<FieldIcon type={selected.type} size={14} />
				{selected?.name.value}
			{:else}
				<span class="text-gray-500 font-normal">{$t('Select Field')}</span>
			{/if}
		</Button>
	</ListboxButton>
	<ListboxOptions
		class="fixed bg-white py-1 border border-gray-100 shadow-md h-64 overflow-y-auto w-full z-50 max-w-[300px] mt-2"
	>
		{#if fields.length}
			{#each fields as field (field.id)}
				<ListboxOption
					value={field.id.value}
					let:selected={selectedItem}
					class="p-2 cursor-pointer hover:bg-gray-100 text-xs text-gray-700 flex gap-2 justify-between"
				>
					<div class="inline-flex gap-2">
						<FieldIcon size={14} type={field.type} />
						{field.name.value}
					</div>
					{#if selectedItem}
						<i class="ti ti-check text-sm" />
					{/if}
				</ListboxOption>
			{/each}
		{:else}
			<div class="p-2">
				<slot name="empty" />
			</div>
		{/if}
	</ListboxOptions>
</Listbox>
