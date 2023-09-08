<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import InvitationListItem from './InvitationListItem.svelte'
	import InviteButton from './InviteButton.svelte'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'

	let q = ''

	$: getInvitations = trpc().invitation.list.query({
		q: q ? q : undefined,
	})

	$: invitations = $getInvitations.data?.invitations ?? []

	const onSubmit = async () => {
		await $getInvitations.refetch()
	}
</script>

<div class="space-y-4">
	<div class="w-full flex items-center justify-between">
		<h5>{$t('empty invitation', { ns: 'common', count: invitations.length })}</h5>
		<div class="flex items-center gap-2">
			<form on:submit={onSubmit}>
				<div class="flex items-center gap-2">
					<Input name="search" bind:value={q} placeholder={$t('search', { ns: 'common' })} />
					<Button variant="secondary" type="submit" size="icon" class="hidden lg:block">
						<i class="ti ti-search"></i>
					</Button>
				</div>
			</form>
			{#if $hasPermission('invitation:invite')}
				<InviteButton />
			{/if}
		</div>
	</div>

	<ul class="gap-4 flex flex-col w-full">
		{#each invitations as invitation (invitation.id)}
			<InvitationListItem {invitation} />
		{/each}
	</ul>
</div>
