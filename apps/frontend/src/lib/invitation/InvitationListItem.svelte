<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { trpc } from '$lib/trpc/client'
	import type { IRolesWithoutOwner } from '@undb/authz'
	import { getInvitationURL, type IQueryInvitation } from '@undb/integrations'
	import { Badge, Dropdown, DropdownItem, Select } from 'flowbite-svelte'
	import type { SelectOptionType } from 'flowbite-svelte/dist/types'
	import { copyText } from 'svelte-copy'
	import * as Card from '$lib/components/ui/card'

	export let invitation: IQueryInvitation

	const items: SelectOptionType[] = [
		{ value: 'admin', name: $t('admin', { ns: 'authz' }) },
		{ value: 'editor', name: $t('editor', { ns: 'authz' }) },
		{ value: 'viewer', name: $t('viewer', { ns: 'authz' }) },
	]

	const getInvitations = trpc().invitation.list.query(
		{},
		{
			enabled: false,
		},
	)

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

	$: url = getInvitationURL($page.url.host, invitation.id)

	let open = false
	const copyURL = () => {
		copyText(url)
		open = false
	}
</script>

<Card.Root class="!max-w-none w-full">
	<Card.Header>
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
					<Dropdown bind:open class="w-48">
						<DropdownItem on:click={copyURL}>
							{$t('copy invitation url', { ns: 'common' })}
						</DropdownItem>
						{#if $hasPermission('invitation:cancel')}
							<DropdownItem
								class="text-red-500"
								on:click={() =>
									$cancelInvitation.mutate({
										id: invitation.id,
									})}>{$t('cancel invite', { ns: 'common' })}</DropdownItem
							>
						{/if}
					</Dropdown>
				</div>
			</div>
		</div>
	</Card.Header>
</Card.Root>
