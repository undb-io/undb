<script lang="ts">
	import type { PageData } from './$types'
	import { sidebarCollapsed } from '$lib/store/ui'
	import MemberList from '$lib/authz/member/MemberList.svelte'
	import InviteButton from '$lib/invitation/InviteButton.svelte'
	import { Hr } from 'flowbite-svelte'

	export let data: PageData

	$: members = data.members.members
</script>

<div class="space-y-2">
	<div class="w-full flex justify-end">
		<InviteButton />
	</div>

	<Hr />

	<MemberList {members} />
</div>

{#if $sidebarCollapsed}
	<div class="fixed top-3 left-3">
		<button on:click={() => ($sidebarCollapsed = false)}>
			<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
		</button>
	</div>
{/if}
