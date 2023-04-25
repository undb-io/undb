<script lang="ts">
	import { Label, Select } from 'flowbite-svelte'
	import { getTable } from '$lib/store/table'

	const table = getTable()

	export let value: string
	export let required = false

	const items =
		$table.schema.fields
			.filter((f) => f.type === 'reference' || f.type === 'tree' || f.type === 'parent')
			.map((f) => ({ value: f.id.value, name: f.name.value })) ?? []
</script>

<div>
	<Label class="space-y-2">
		<span class="space-x-1">
			<span>referenecFieldId</span>
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</span>
		<Select bind:value {items} />
	</Label>
</div>
