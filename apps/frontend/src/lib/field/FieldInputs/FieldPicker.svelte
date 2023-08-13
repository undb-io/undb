<script lang="ts">
	import cx from 'classnames'
	import type { IFieldType, IQueryFieldSchema } from '@undb/core'
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import { identity } from 'lodash-es'
	import FieldIcon from '../FieldIcon.svelte'
	import { t } from '$lib/i18n'

	export let value: string = ''

	export let selected: IQueryFieldSchema | undefined = undefined
	export let selectedId: string | undefined = undefined
	export let type: IFieldType | undefined = undefined
	export let readonly = false

	export let fields: IQueryFieldSchema[] = []
	export let filter: (field: IQueryFieldSchema) => boolean = identity

	$: filteredFields = fields.filter(filter)

	$: selected = value ? filteredFields.find((f) => f.id === value) : undefined
	$: selectedId = selected?.id
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
			{selected?.name}
		</span>
	{:else}
		<span class="text-gray-500 font-normal">{$t('Select Field')}</span>
	{/if}
</Button>
{#if !readonly}
	<Dropdown
		style="z-index: 50;"
		class="w-[400px] z-[99999] border rounded-sm bg-white shadow-sm dark:shadow-gray-500 dark:bg-gray-700"
		bind:open
	>
		{#if filteredFields.length}
			{#each filteredFields as field (field.id)}
				<Radio value={field.id} bind:group={value} custom on:change={() => (open = false)}>
					<li
						class="w-full px-3 py-2 flex justify-between hover:bg-gray-100 transition cursor-pointer dark:text-white dark:hover:!text-gray-600"
						class:bg-gray-100={selected?.id === field.id}
					>
						<div
							class={cx(
								'inline-flex gap-2 items-center text-gray-600 dark:text-white dark:hover:text-gray-600',
								selected?.id === field.id ? 'dark:!text-gray-600' : '',
							)}
						>
							<FieldIcon size={14} type={field.type} />
							<span class="text-xs">
								{field.name}
							</span>
						</div>
						<span>
							{#if selected?.id === field.id}
								<i class="ti ti-check text-sm dark:text-gray-600" />
							{/if}
						</span>
					</li>
				</Radio>
			{/each}
		{:else}
			<div class="p-2">
				<slot name="empty" />
			</div>
		{/if}
	</Dropdown>
{/if}
