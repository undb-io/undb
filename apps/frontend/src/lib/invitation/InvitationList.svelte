<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import { Heading, P } from 'flowbite-svelte'
	import InvitationListItem from './InvitationListItem.svelte'
	import InviteButton from './InviteButton.svelte'
	import { t } from '$lib/i18n'

	const getInvitations = trpc().invitation.list.query()

	$: invitations = $getInvitations.data?.invitations ?? []
</script>

<div class="space-y-4">
	<div class="w-full flex justify-between">
		<Heading tag="h5">{$t('empty invitation', { ns: 'common', count: invitations.length })}</Heading>
		<div>
			<InviteButton />
		</div>
	</div>

	<ul class="gap-4 flex flex-col w-full">
		{#each invitations as invitation (invitation.id)}
			<InvitationListItem {invitation} />
		{/each}
	</ul>
</div>
