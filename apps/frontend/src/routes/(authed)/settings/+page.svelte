<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import InviteButton from "$lib/components/blocks/invite/invite-button.svelte"
  import MembersTable from "$lib/components/blocks/member/members-table.svelte"
  import { Input } from "$lib/components/ui/input"
  import { SettingsIcon, Users, UsersIcon } from "lucide-svelte"
  import type { LayoutData } from "./$types"
  import { queryParam, ssp } from "sveltekit-search-params"
  import InvitationsListButton from "$lib/components/blocks/invitations/invitations-list-button.svelte"
  import { hasPermission } from "$lib/store/workspace-member.store"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"
  import SpaceSetting from "$lib/components/blocks/space/space-setting.svelte"

  const mq = queryParam("mq")
  const tab = queryParam("tab", ssp.string())

  export let data: LayoutData
  $: getMembersStore = data.getMembersStore

  $: members = $getMembersStore.data?.members ?? []

  function fetchMembers() {
    getMembersStore.fetch({ variables: { q: $mq } })
  }

  $: store = data.indexDataStore
  $: space = $store.data?.space
  onMount(async () => {
    if ($store.data?.space?.isPersonal) {
      await goto("/", { replaceState: true })
    }
  })
</script>

<main class="space-y-2 p-6">
  <div class="space-y-2">
    <h3 class="flex items-center text-xl">
      <SettingsIcon class="mr-2 h-4 w-4" />
      Settings
    </h3>
  </div>

  <Tabs.Root bind:value={$tab} class="w-full">
    <Tabs.List>
      <Tabs.Trigger value="members">
        <UsersIcon class="mr-2 h-4 w-4" />
        Members
      </Tabs.Trigger>
      <Tabs.Trigger value="settings">
        <SettingsIcon class="mr-2 h-4 w-4" />
        Settings
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="members" class="space-y-2">
      <div class="flex justify-between">
        <h4 class="flex items-center">
          <Users class="mr-2 h-4 w-4" />
          Members
        </h4>
        <div class="flex items-center gap-2">
          {#if $hasPermission("authz:invite")}
            <InviteButton />
          {/if}
          {#if $hasPermission("authz:listInvitation")}
            <InvitationsListButton />
          {/if}
        </div>
      </div>

      <Input bind:value={$mq} on:change={fetchMembers} placeholder="Search Members..." class="max-w-xs" />
      <MembersTable {members} />
    </Tabs.Content>
    <Tabs.Content value="settings">
      {#if space}
        <SpaceSetting {space} />
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</main>
