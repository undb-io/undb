<script lang="ts">
	import type { IRLSAction, RLS } from '@undb/authz/dist'
	import { Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'

	export let action: IRLSAction

	const items: SelectOptionType[] = [{ value: 'anyone', name: 'Anyone' }]
</script>

<div class="flex items-center gap-2 px-1">
	<span>when</span>
	<Select class="inline-flex w-32" value="anyone" {items}></Select>
	<span class="flex-1"> matched following ruls can {action}</span>
</div>
