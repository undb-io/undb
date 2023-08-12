<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { trpc } from '$lib/trpc/client'
	import type { IRolesWithoutOwner } from '@undb/authz'
	import type { IQueryInvitation } from '@undb/integrations'
	import { Badge, Card, Dropdown, DropdownItem, Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'

	export let invitation: IQueryInvitation

	const items: SelectOptionType[] = [
		{ value: 'admin', name: $t('admin', { ns: 'authz' }) },
		{ value: 'editor', name: $t('editor', { ns: 'authz' }) },
		{ value: 'viewer', name: $t('viewer', { ns: 'authz' }) },
	]

	const getInvitations = trpc().invitation.list.query(undefined, {
		enabled: false,
	})

	const reinviteMutation = trpc().invitation.reinvite.mutation({})

	const reinvite = (e: Event) => {
		const target = e.target as HTMLSelectElement
		const role = target.value as IRolesWithoutOwner
		$reinviteMutation.mutate({
			id: invitation.id,
			role,
		})
	}

	const cancelInvitation = trpc().invitation.cancel.mutation({
		async onSuccess(data, variables, context) {
			if ($hasPermission('invitation:list')) {
				await $getInvitations.refetch()
			}
		},
	})
</script>

<Card class="!max-w-none w-full">
	<div class="w-full flex items-center justify-between">
		<div class="flex items-center gap-2">
			<i class="ti ti-mail"></i>
			<span class="text-sm">
				{invitation.email}
			</span>
		</div>
		<div class="flex items-center gap-3">
			<div>
				{#if $hasPermission('invitation:invite')}
					<Select {items} value={invitation.role} size="sm" class="col-span-1" on:change={reinvite} />
				{:else}
					<Badge>{$t(invitation.role, { ns: 'authz' })}</Badge>
				{/if}
			</div>
			<div>
				<button>
					<i class="ti ti-dots"></i>
				</button>
				{#if $hasPermission('invitation:cancel')}
					<Dropdown class="w-48">
						<DropdownItem
							class="text-red-500"
							on:click={() =>
								$cancelInvitation.mutate({
									id: invitation.id,
								})}>{$t('cancel invite', { ns: 'common' })}</DropdownItem
						>
					</Dropdown>
				{/if}
			</div>
		</div>
	</div>
</Card>
