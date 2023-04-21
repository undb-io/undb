<script lang="ts">
	import { Badge, Button, Checkbox, Dropdown } from 'flowbite-svelte'
	import type { IQueryTable } from '@undb/core'

	export let group: string[] | undefined
	export let table: IQueryTable

	$: fields = table.schema ?? []
</script>

<Button color="alternative" class="max-w-max" {...$$restProps}>
	{@const first = fields.find((f) => f.id === group?.[0])}
	{#if !group?.length}
		<span>select field</span>
	{:else if group?.length === 1}
		<Badge color="dark">{first?.name ?? ''}</Badge>
	{:else}
		<Badge color="dark" class="mr-2">{first?.name ?? ''}</Badge> and {group?.length - 1} more
	{/if}
</Button>
<Dropdown class="h-64 overflow-y-auto py-1 shadow-md">
	{#each fields as field}
		<li>
			<Checkbox value={field.id} bind:group class="px-3 py-2 hover:bg-gray-100">
				{field.name}
			</Checkbox>
		</li>
	{/each}
</Dropdown>
