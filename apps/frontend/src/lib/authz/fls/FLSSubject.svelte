<script lang="ts">
	import UsersPicker from '$lib/cell/CellInput/UsersPicker.svelte'
	import type { IRLSAction } from '@undb/authz'
	import type { ISubjectType } from './fls.type'
	import { t } from '$lib/i18n'
	import { onMount } from 'svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'

	export let action: IRLSAction

	const items = [
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

	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button disabled={readonly} variant="outline" builders={[builder]}>
				{$t(subject, { ns: 'authz' })}
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-32">
			<DropdownMenu.RadioGroup bind:value={subject}>
				{#each items as item}
					<DropdownMenu.RadioItem value={item.value}>{item.name}</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	{#if subject === 'users'}
		<UsersPicker {readonly} bind:value />
	{/if}

	<span class="flex-1">
		{$t('fls match rule', { ns: 'authz' })}
		{$t(action, { ns: 'authz' })}
	</span>
</div>
