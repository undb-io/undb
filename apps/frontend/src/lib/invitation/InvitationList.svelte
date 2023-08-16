<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import { Button, Heading, Search } from 'flowbite-svelte'
	import InvitationListItem from './InvitationListItem.svelte'
	import InviteButton from './InviteButton.svelte'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'

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
	<div class="w-full flex justify-between">
		<Heading tag="h5">{$t('empty invitation', { ns: 'common', count: invitations.length })}</Heading>
		<div class="flex items-center gap-2">
			<form on:submit={onSubmit}>
				<div class="flex items-center gap-2">
					<Search bind:value={q} size="sm" />
					<Button type="submit" size="xs" class="!p-2.5 hidden lg:block">
						<svg
							class="w-3 h-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
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
