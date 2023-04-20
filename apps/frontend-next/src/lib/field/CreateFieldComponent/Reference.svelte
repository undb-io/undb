<script lang="ts">
	import { page } from '$app/stores'
	import { Badge, Button, Checkbox, Dropdown, Label, Select } from 'flowbite-svelte'
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import type { IQueryTable } from '@undb/core'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const { value: foreignTableId } = formFieldProxy(form, 'foreignTableId')
	$: tables = $page.data.tables as IQueryTable[]
	$: items = tables.map((table) => ({ name: table.name, value: table.id }))

	const { value: displayFieldIds } = formFieldProxy(form, 'displayFieldIds')
	$: table = tables.find((table) => table.id === $foreignTableId)
	$: fields = table?.schema ?? []

	$: selectedFields = ($displayFieldIds ?? []) as string[]

	$: table, ($displayFieldIds = [] as never)
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="space-y-2">
		<Label class="inline-flex items-center gap-1">
			foreign table
			<span class="text-red-500">*</span>
		</Label>
		<Select bind:value={$foreignTableId} {items} name="foreignTableId" />
	</div>

	<div class="space-y-2">
		<Label class="inline-flex items-center gap-2">
			<span>foreign table</span>
		</Label>
		<div>
			<Button color="alternative" class="max-w-max" disabled={!table}>
				{@const first = fields.find((f) => f.id === selectedFields[0])}
				{#if !selectedFields.length}
					<span>select field</span>
				{:else if selectedFields.length === 1}
					<Badge color="dark">{first?.name ?? ''}</Badge>
				{:else}
					<Badge color="dark" class="mr-2">{first?.name ?? ''}</Badge> and {selectedFields.length - 1} more
				{/if}
			</Button>
			<Dropdown>
				{#each fields as field}
					<Checkbox value={field.id} bind:group={$displayFieldIds} class="px-3 py-2 hover:bg-gray-100">
						{field.name}
					</Checkbox>
				{/each}
			</Dropdown>
		</div>
	</div>
</div>
