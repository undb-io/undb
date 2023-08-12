<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import type { IQueryInvitation } from '@undb/integrations/dist'
	import { Badge, Card, Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'

	export let invitation: IQueryInvitation

	const items: SelectOptionType[] = [
		{ value: 'admin', name: $t('admin', { ns: 'authz' }) },
		{ value: 'editor', name: $t('editor', { ns: 'authz' }) },
		{ value: 'viewer', name: $t('viewer', { ns: 'authz' }) },
	]

	const reinvaite = () => {
		throw new Error('todo')
	}
</script>

<Card class="!max-w-none w-full">
	<div class="w-full flex items-center justify-between">
		<div class="flex items-center gap-2">
			<i class="ti ti-mail"></i>
			<span class="text-sm">
				{invitation.email}
			</span>
		</div>
		<div>
			{#if $hasPermission('invitation:invite')}
				<Select {items} value={invitation.role} size="sm" class="col-span-1" on:change={reinvaite} />
			{:else}
				<Badge>{$t(invitation.role, { ns: 'authz' })}</Badge>
			{/if}
		</div>
	</div>
</Card>
