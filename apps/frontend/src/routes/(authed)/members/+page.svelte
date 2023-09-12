<script lang="ts">
	import type { PageData } from './$types'
	import { sidebarCollapsed } from '$lib/store/ui'
	import MemberList from '$lib/authz/member/MemberList.svelte'
	import InviteModal from '$lib/invitation/InviteModal.svelte'
	import InvitationList from '$lib/invitation/InvitationList.svelte'
	import { t } from '$lib/i18n'
	import * as Tabs from '$lib/components/ui/tabs'

	export let data: PageData

	$: members = data.members.members
</script>

<div class="space-y-2 h-full">
	<Tabs.Root value="members" class="h-full pt-6">
		<Tabs.List>
			<Tabs.Trigger value="members">
				{$t('Members', { ns: 'common' })}
			</Tabs.Trigger>
			<Tabs.Trigger value="invitations">
				{$t('Invitations', { ns: 'common' })}
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="members">
			<MemberList {members} />
		</Tabs.Content>
		<Tabs.Content value="invitations">
			<InvitationList />
		</Tabs.Content>
	</Tabs.Root>
</div>

{#if $sidebarCollapsed}
	<div class="fixed top-3 left-3">
		<button on:click={() => ($sidebarCollapsed = false)}>
			<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
		</button>
	</div>
{/if}

<InviteModal />
