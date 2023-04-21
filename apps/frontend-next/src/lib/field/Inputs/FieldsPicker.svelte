<script lang="ts">
	import { Badge, Button, Checkbox, Dropdown } from 'flowbite-svelte'
	import { TableFactory, type IQueryTable, type Field } from '@undb/core'
	import { identity } from 'lodash'

	export let group: string[] | undefined
	export let table: IQueryTable
	export let filter: (field: Field) => boolean = identity

	$: coreTable = TableFactory.fromQuery(table)
	$: fields = coreTable.schema.fields.filter(filter)
</script>

<Button color="alternative" class="max-w-max" {...$$restProps}>
	{@const first = fields.find((f) => f.id.value === group?.[0])}
	{#if !group?.length}
		<span>select field</span>
	{:else if group?.length === 1}
		<Badge color="dark">{first?.name.value ?? ''}</Badge>
	{:else}
		<Badge color="dark" class="mr-2">{first?.name.value ?? ''}</Badge> and {group?.length - 1} more
	{/if}
</Button>
<Dropdown class="max-h-64 w-48 overflow-y-auto py-1 shadow-md">
	{#each fields as field}
		<li>
			<Checkbox value={field.id.value} bind:group class="px-3 py-2 hover:bg-gray-100">
				{field.name.value}
			</Checkbox>
		</li>
	{/each}
</Dropdown>
