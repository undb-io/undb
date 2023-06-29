<script lang="ts">
	import { Badge, Button, Checkbox, Dropdown, Popover } from 'flowbite-svelte'
	import { canDisplay, type IQueryFieldSchema } from '@undb/core'
	import Portal from 'svelte-portal'
	import FieldIcon from '../FieldIcon.svelte'
	import { t } from '$lib/i18n'

	export let group: string[] | undefined = []
	export let fields: IQueryFieldSchema[] = []
	export let tableName: string | undefined
	export let filter: (field: IQueryFieldSchema) => boolean = (f) => canDisplay(f.type)

	$: displayFields = fields.filter((f) => f.display)
	$: filteredFields = fields.filter(filter)
	$: selected = filteredFields.filter((f) => group?.includes(f.id))
</script>

<Button id="displayFieldIds" color="alternative" class="max-w-max" {...$$restProps}>
	{@const first = filteredFields.find((f) => f.id === group?.[0])}
	{#if !group?.length}
		<span>
			{#if !displayFields.length}
				{$t('no display fields in', { table: tableName })}
			{:else}
				<span>{@html $t('Auto Display Field', { table: tableName })}</span>
				<Popover class="w-64 text-sm font-light" title={$t('Display Fields') ?? undefined}>
					<div class="flex flex-wrap gap-2">
						{#each displayFields as field}
							<Badge>{field.name}</Badge>
						{/each}
					</div>
				</Popover>
			{/if}
		</span>
	{:else if group?.length === 1}
		<Badge color="dark">{first?.name ?? ''}</Badge>
	{:else}
		<span>
			<Badge color="dark" class="mr-2">{first?.name ?? ''}</Badge>{$t('and n more', {
				ns: 'common',
				n: group?.length,
			})}</span
		>
		<Popover class="w-64 text-sm font-light" title={$t('Display Fields') ?? undefined}>
			<div class="flex flex-wrap gap-2">
				{#each selected as field}
					<Badge>{field.name}</Badge>
				{/each}
			</div>
		</Popover>
	{/if}
</Button>
<Portal target="body">
	<Dropdown triggeredBy="#displayFieldIds" inline class="max-h-64 w-64 overflow-y-auto py-1 shadow-md z-[999999]">
		{#if !filteredFields.length}
			<div class="px-3 py-2">
				<slot name="empty" />
			</div>
		{/if}

		{#each filteredFields as field}
			{@const selected = !!group?.includes(field.id)}
			<Checkbox value={field.id} bind:group class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer" custom>
				<li class="w-full flex justify-between items-center text-gray-500 dark:text-gray-200">
					<div class="flex flex-1 items-center gap-2">
						<FieldIcon type={field.type} size={16} />
						<span>
							{field.name}
						</span>
					</div>
					{#if selected}
						<i class="ti ti-check text-sm" />
					{/if}
				</li>
			</Checkbox>
		{/each}
	</Dropdown>
</Portal>
