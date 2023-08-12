<script lang="ts">
	import type { IQueryMember } from '@undb/authz'
	import MemberListItem from './MemberListItem.svelte'
	import InviteButton from '$lib/invitation/InviteButton.svelte'
	import { hasPermission } from '$lib/store/authz'

	export let members: IQueryMember[]
</script>

<div class="space-y-4">
	{#if $hasPermission('invitation:invite')}
		<div class="w-full flex justify-end">
			<InviteButton />
		</div>
	{/if}

	<ul class="gap-4 flex flex-col w-full">
		{#each members as member (member.id)}
			<MemberListItem {member} />
		{/each}
	</ul>
</div>
