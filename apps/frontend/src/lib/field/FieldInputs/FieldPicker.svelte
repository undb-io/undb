<script lang="ts">
	import cx from 'classnames'
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'
	import type { Field, IFieldType, Table } from '@undb/core'
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import { identity } from 'lodash-es'
	import FieldIcon from '../FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import Portal from 'svelte-portal'

	export let value: string = ''
	export let table: Table
	export let filter: (field: Field) => boolean = identity

	export let selected: Field | undefined = undefined
	export let type: IFieldType | undefined = undefined

	$: fields = table.schema.fields.filter(filter)

	$: selected = value ? table.schema.fields.find((f) => f.id.value === value) : undefined
	$: type = selected?.type

	let open = false
</script>

<Button
	color="alternative"
	{...$$restProps}
	class={cx($$restProps.class, 'gap-2 field_picker')}
	on:click={() => (open = true)}
>
	{#if selected}
		<FieldIcon type={selected.type} size={14} />
		<span class="whitespace-nowrap">
			{selected?.name.value}
		</span>
	{:else}
		<span class="text-gray-500 font-normal">{$t('Select Field')}</span>
	{/if}
</Button>
<Portal target="body">
	<Dropdown triggeredBy=".field_picker" frameClass="z-[100]" bind:open>
		{#if fields.length}
			{#each fields as field (field.id)}
				<Radio value={field.id.value} bind:group={value} custom on:change={() => (open = false)}>
					<div
						role="listitem"
						class="w-full p-2 pr-4 flex justify-between hover:bg-gray-100 transition cursor-pointer"
						class:bg-gray-100={selected?.id.value === field.id.value}
					>
						<div class="inline-flex gap-2 items-center text-gray-600">
							<FieldIcon size={14} type={field.type} />
							<span class="text-xs">
								{field.name.value}
							</span>
						</div>
						<span>
							{#if selected?.id.value === field.id.value}
								<i class="ti ti-check text-sm" />
							{/if}
						</span>
					</div>
				</Radio>
			{/each}
		{:else}
			<div class="p-2">
				<slot name="empty" />
			</div>
		{/if}
	</Dropdown>
</Portal>
