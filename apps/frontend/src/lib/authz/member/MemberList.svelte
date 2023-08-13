<script lang="ts">
	import type { IQueryMember } from '@undb/authz'
	import MemberListItem from './MemberListItem.svelte'

	export let members: IQueryMember[]
</script>

<ul class="gap-4 flex flex-col w-full">
	{#each members as member (member.id)}
		<MemberListItem {member} />
	{/each}
</ul>
