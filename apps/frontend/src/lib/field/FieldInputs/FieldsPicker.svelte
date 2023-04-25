<script lang="ts">
	import { Badge, Button, Checkbox, Dropdown, Popover } from 'flowbite-svelte'
	import type { Field, Table } from '@undb/core'
	import { identity } from 'lodash-es'
	import Portal from 'svelte-portal'
	import FieldIcon from '../FieldIcon.svelte'

	export let group: string[] | undefined
	export let table: Table
	export let filter: (field: Field) => boolean = identity

	$: fields = table.getOrderedFields().filter(filter)
	$: selected = fields.filter((f) => group?.includes(f.id.value))
</script>

<Button id="displayFieldIds" color="alternative" class="max-w-max" {...$$restProps}>
	{@const first = fields.find((f) => f.id.value === group?.[0])}
	{#if !group?.length}
		{@const displayFields = table.schema.displayFields}
		<span>
			{#if !displayFields.length}
				no display field in <Badge color="dark">{table.name.value}</Badge>
			{:else}
				<span>Auto</span>
				<Popover class="w-64 text-sm font-light" title="display fields">
					<div class="flex flex-wrap gap-2">
						{#each displayFields as field}
							<Badge>{field.name.value}</Badge>
						{/each}
					</div>
				</Popover>
			{/if}
		</span>
	{:else if group?.length === 1}
		<Badge color="dark">{first?.name.value ?? ''}</Badge>
	{:else}
		<span>
			<Badge color="dark" class="mr-2">{first?.name.value ?? ''}</Badge> and {group?.length - 1} more
		</span>
		<Popover class="w-64 text-sm font-light" title="display fields">
			<div class="flex flex-wrap gap-2">
				{#each selected as field}
					<Badge>{field.name.value}</Badge>
				{/each}
			</div>
		</Popover>
	{/if}
</Button>
<Portal target="body">
	<Dropdown
		triggeredBy="#displayFieldIds"
		inline
		class="max-h-64 w-64 overflow-y-auto py-1 shadow-md"
		frameClass="z-[100]"
	>
		{#if !fields.length}
			<div class="px-3 py-2">
				<slot name="empty" />
			</div>
		{/if}

		{#each fields as field}
			{@const selected = !!group?.includes(field.id.value)}
			<Checkbox value={field.id.value} bind:group class="px-3 py-2 hover:bg-gray-100 cursor-pointer" custom>
				<li class="w-full flex justify-between items-center text-gray-500">
					<div class="flex flex-1 items-center gap-2">
						<FieldIcon type={field.type} size={16} />
						<span>
							{field.name.value}
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
