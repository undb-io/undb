<script lang="ts">
	import { Badge, Button, Checkbox, Dropdown, Radio } from 'flowbite-svelte'
	import { TableFactory, type IQueryTable, type Field } from '@undb/core'
	import { identity } from 'lodash'

	export let value: string
	export let table: IQueryTable
	export let filter: (field: Field) => boolean = identity

	$: coreTable = TableFactory.fromQuery(table)
	$: fields = coreTable.schema.fields.filter(filter)

	$: selected = value ? fields.find((f) => f.id.value === value) : undefined

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
