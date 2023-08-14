<script lang="ts">
	import type { PageData } from './$types'
	import { sidebarCollapsed } from '$lib/store/ui'
	import MemberList from '$lib/authz/member/MemberList.svelte'
	import { TabItem, Tabs } from 'flowbite-svelte'
	import InviteModal from '$lib/invitation/InviteModal.svelte'
	import { inviteModal } from '$lib/store/modal'
	import InvitationList from '$lib/invitation/InvitationList.svelte'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'

	export let data: PageData

	$: members = data.members.members
</script>

<div class="space-y-2">
	<Tabs style="underline">
		<TabItem open title={$t('Members', { ns: 'common' })}>
			<MemberList {members} />
		</TabItem>
		<TabItem title={$t('Invitations', { ns: 'common' })} disabled={!$hasPermission('invitation:list')}>
			<InvitationList />
		</TabItem>
	</Tabs>
</div>

{#if $sidebarCollapsed}
	<div class="fixed top-3 left-3">
		<button on:click={() => ($sidebarCollapsed = false)}>
			<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
		</button>
	</div>
{/if}

{#if $inviteModal.open}
	<InviteModal />
{/if}
