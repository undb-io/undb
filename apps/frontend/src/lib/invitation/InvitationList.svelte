<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import InvitationListItem from './InvitationListItem.svelte'
	import InviteButton from './InviteButton.svelte'

	const getInvitations = trpc().invitation.list.query()

	$: invitations = $getInvitations.data?.invitations ?? []
</script>

<div class="space-y-4">
	<div class="w-full flex justify-end">
		<InviteButton />
	</div>

	<ul class="gap-4 flex flex-col w-full">
		{#each invitations as invitation (invitation.id)}
			<InvitationListItem {invitation} />
		{/each}
	</ul>
</div>
