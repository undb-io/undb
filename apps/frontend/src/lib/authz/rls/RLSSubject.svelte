<script lang="ts">
	import UsersPicker from '$lib/cell/CellInput/UsersPicker.svelte'
	import type { IRLSAction } from '@undb/authz/dist'
	import { Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'
	import type { ISubjectType } from './rls.type'

	export let action: IRLSAction

	const items: SelectOptionType[] = [
		{ value: 'anyone', name: 'Anyone' },
		{ value: 'users', name: 'Users' },
	]

	export let subject: ISubjectType = 'anyone'

	export let value: string[] = []
	$: if (value.length) {
		subject = 'users'
	}
</script>

<div class="flex items-center gap-2 px-1">
	<span>when</span>
	<Select class="inline-flex w-32" bind:value={subject} {items}></Select>
	<span class="flex-1"> matched following ruls can {action}</span>
</div>

{#if subject === 'users'}
	<UsersPicker bind:value />
{/if}
