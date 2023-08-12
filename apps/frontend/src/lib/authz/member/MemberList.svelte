<script lang="ts">
	import type { IQueryMember } from '@undb/authz'
	import MemberListItem from './MemberListItem.svelte'
	import InviteButton from '$lib/invitation/InviteButton.svelte'

	export let members: IQueryMember[]
</script>

<div class="space-y-4">
	<div class="w-full flex justify-end">
		<InviteButton />
	</div>

	<ul class="gap-4 flex flex-col w-full">
		{#each members as member (member.id)}
			<MemberListItem {member} />
		{/each}
	</ul>
</div>
