<script lang="ts">
	import { page } from '$app/stores'
	import { Label, Select } from 'flowbite-svelte'
	import type { IQueryTable } from '@undb/core'

	export let value: string

	$: tables = $page.data.tables as IQueryTable[]
	$: items = tables.map((table) => ({ name: table.name, value: table.id }))
</script>

<div class="space-y-2">
	<Label class="inline-flex items-center gap-1">
		foreign table
		<span class="text-red-500">*</span>
	</Label>
	<Select bind:value {items} {...$$restProps} />
</div>
