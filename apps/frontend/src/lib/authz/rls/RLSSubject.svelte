<script lang="ts">
	import UsersPicker from '$lib/cell/CellInput/UsersPicker.svelte'
	import type { IRLSAction } from '@undb/authz'
	import { Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'
	import type { ISubjectType } from './rls.type'
	import { t } from '$lib/i18n'
	import { onMount } from 'svelte'

	export let action: IRLSAction

	const items: SelectOptionType[] = [
		{ value: 'anyone', name: $t('anyone', { ns: 'authz' }) },
		{ value: 'users', name: $t('users', { ns: 'authz' }) },
	]

	export let value: string[] = []
	export let subject: ISubjectType = 'anyone'

	onMount(() => {
		if (value.length) {
			subject = 'users'
		}
	})

	export let readonly = false
</script>

<div class="flex items-center gap-2 px-1 text-sm">
	<span>{$t('when', { ns: 'common' })}</span>
	<Select size="sm" class="inline-flex w-32" bind:value={subject} {items} disabled={readonly}></Select>

	{#if subject === 'users'}
		<UsersPicker {readonly} bind:value />
	{/if}

	<span class="flex-1">
		{$t('rls match rule', { ns: 'authz' })}
		{$t(action, { ns: 'authz' })}
	</span>
</div>
