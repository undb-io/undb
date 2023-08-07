<script lang="ts">
	import UsersPicker from '$lib/cell/CellInput/UsersPicker.svelte'
	import type { IRLSAction } from '@undb/authz'
	import { Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'
	import type { ISubjectType } from './rls.type'
	import { t } from '$lib/i18n'

	export let action: IRLSAction

	const items: SelectOptionType[] = [
		{ value: 'anyone', name: $t('anyone', { ns: 'authz' }) },
		{ value: 'users', name: $t('users', { ns: 'authz' }) },
	]

	export let subject: ISubjectType = 'anyone'

	export let value: string[] = []
	$: if (value.length) {
		subject = 'users'
	}
</script>

<div class="flex items-center gap-2 px-1 text-sm">
	<span>{$t('when', { ns: 'common' })}</span>
	<Select class="inline-flex w-32" bind:value={subject} {items}></Select>
	<span class="flex-1">
		{$t('rls match rule', { ns: 'authz' })}
		{$t(action, { ns: 'authz' })}
	</span>
</div>

{#if subject === 'users'}
	<UsersPicker bind:value />
{/if}
