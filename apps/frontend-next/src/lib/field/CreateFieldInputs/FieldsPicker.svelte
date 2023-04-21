<script lang="ts">
	import { Badge, Button, Checkbox, Dropdown, Popover } from 'flowbite-svelte'
	import type { Field, Table } from '@undb/core'
	import { identity } from 'lodash'
	import Portal from 'svelte-portal'

	export let group: string[] | undefined
	export let table: Table
	export let filter: (field: Field) => boolean = identity

	$: fields = table.schema.fields.filter(filter)
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
					<div class="flex gap-2">
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
			<div class="flex gap-2">
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
		class="max-h-64 w-48 overflow-y-auto py-1 shadow-md"
		frameClass="z-[100]"
	>
		{#if !fields.length}
			<div class="px-3 py-2">
				<slot name="empty" />
			</div>
		{/if}

		{#each fields as field}
			<li>
				<Checkbox value={field.id.value} bind:group class="px-3 py-2 hover:bg-gray-100">
					{field.name.value}
				</Checkbox>
			</li>
		{/each}
	</Dropdown>
</Portal>
