<script lang="ts">
	import type { PageData } from './$types'
	import { sidebarCollapsed } from '$lib/store/ui'
	import MemberList from '$lib/authz/member/MemberList.svelte'

	export let data: PageData

	$: members = data.members.members
</script>

<MemberList {members} />

{#if $sidebarCollapsed}
	<div class="fixed top-3 left-3">
		<button on:click={() => ($sidebarCollapsed = false)}>
			<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
		</button>
	</div>
{/if}
