<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { trpc } from '$lib/trpc/client'
	import { getInvitationURL, type IQueryInvitation } from '@undb/integrations'
	import { copyText } from 'svelte-copy'
	import * as Card from '$lib/components/ui/card'
	import { Badge } from '$lib/components/ui/badge'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'
	import type { IRolesWithoutOwner } from '@undb/authz'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'

	export let invitation: IQueryInvitation

	const items = [
		{ value: 'admin', name: $t('admin', { ns: 'authz' }) },
		{ value: 'editor', name: $t('editor', { ns: 'authz' }) },
		{ value: 'viewer', name: $t('viewer', { ns: 'authz' }) },
	] as const

	const getInvitations = trpc().invitation.list.query(
		{},
		{
			enabled: false,
		},
	)

	const reinviteMutation = trpc().invitation.reinvite.mutation({})

	const reinvite = (value: IRolesWithoutOwner) => {
		$reinviteMutation.mutate({
			id: invitation.id,
			role: value,
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

	let confirmCancelInvitation = false
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
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button variant="outline" builders={[builder]} class="gap-2">
									<span>
										{$t(invitation.role, { ns: 'authz' })}
									</span>
									<i class="ti ti-chevron-down"></i>
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56">
								<DropdownMenu.RadioGroup bind:value={invitation.role}>
									{#each items as item}
										<DropdownMenu.RadioItem
											value={item.value}
											on:click={() => {
												reinvite(item.value)
											}}
										>
											{item.name}
										</DropdownMenu.RadioItem>
									{/each}
								</DropdownMenu.RadioGroup>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{:else}
						<Badge>{$t(invitation.role, { ns: 'authz' })}</Badge>
					{/if}
				</div>
				<div>
					<DropdownMenu.Root bind:open>
						<DropdownMenu.Trigger>
							<i class="ti ti-dots"></i>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-48">
							<DropdownMenu.Item on:click={copyURL}>
								{$t('copy invitation url', { ns: 'common' })}
							</DropdownMenu.Item>
							{#if $hasPermission('invitation:cancel')}
								<DropdownMenu.Item
									on:click={() => {
										confirmCancelInvitation = true
									}}
									class="text-red-500"
								>
									{$t('cancel invite', { ns: 'common' })}
								</DropdownMenu.Item>
							{/if}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</div>
	</Card.Header>
</Card.Root>

<AlertDialog.Root bind:open={confirmCancelInvitation}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('Confirm Cancel Invitation', { ns: 'common' })}
			</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => (confirmCancelInvitation = false)}>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				on:click={() => {
					$cancelInvitation.mutate({
						id: invitation.id,
					})
				}}
			>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
