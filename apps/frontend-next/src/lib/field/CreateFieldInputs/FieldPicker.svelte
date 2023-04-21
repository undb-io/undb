<script lang="ts">
	import type { Field, IFieldType, Table } from '@undb/core'
	import { Badge, Button, Dropdown, Radio } from 'flowbite-svelte'
	import { identity } from 'lodash'

	export let value: string = ''
	export let table: Table
	export let filter: (field: Field) => boolean = identity

	export let selected: Field | undefined = undefined
	export let type: IFieldType | undefined = undefined

	$: fields = table.schema.fields.filter(filter)

	$: selected = value ? fields.find((f) => f.id.value === value) : undefined
	$: type = selected?.type

	$: open = false
</script>

<Button color="alternative" class="max-w-max" {...$$restProps}>
	{#if !selected}
		Select Field
	{:else}
		<Badge color="dark">{selected.name.value}</Badge>
	{/if}
</Button>
<Dropdown class="max-h-64 w-48 overflow-y-auto py-1 shadow-md" bind:open>
	{#if !fields.length}
		<div class="px-3 py-2">
			<slot name="empty" />
		</div>
	{/if}

	{#each fields as field}
		<li>
			<Radio
				value={field.id.value}
				bind:group={value}
				class="px-3 py-2 hover:bg-gray-100"
				custom
				on:change={() => (open = false)}
			>
				{field.name.value}
			</Radio>
		</li>
	{/each}
</Dropdown>
