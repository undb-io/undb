<script lang="ts">
	import { Label, Select } from 'flowbite-svelte'
	import { getTable } from '$lib/context'

	const table = getTable()

	export let value: string

	const items =
		$table.schema.fields
			.filter((f) => f.type === 'reference' || f.type === 'tree' || f.type === 'parent')
			.map((f) => ({ value: f.id.value, name: f.name.value })) ?? []
</script>

<div>
	<Label class="space-y-2">
		<span>referenecFieldId</span>
		<Select bind:value {items} />
	</Label>
</div>
