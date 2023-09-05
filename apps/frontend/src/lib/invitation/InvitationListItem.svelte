<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { trpc } from '$lib/trpc/client'
	import { getInvitationURL, type IQueryInvitation } from '@undb/integrations'
	import { copyText } from 'svelte-copy'
	import * as Card from '$lib/components/ui/card'
	import * as Select from '$lib/components/ui/select'
	import { Badge } from '$lib/components/ui/badge'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	export let invitation: IQueryInvitation

	const items = [
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

	const reinvite = (value: any) => {
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
						<Select.Root selected={{ value: invitation.role }} onSelectedChange={reinvite}>
							<Select.Trigger class="w-[120px]">
								<Select.Value>{invitation.role}</Select.Value>
							</Select.Trigger>
							<Select.Content>
								{#each items as item}
									<Select.Item value={item.value}>{item.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
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
										$cancelInvitation.mutate({
											id: invitation.id,
										})
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
