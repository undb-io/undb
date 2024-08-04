<script lang="ts">
  import InviteButton from "$lib/components/blocks/invite/invite-button.svelte"
  import MembersTable from "$lib/components/blocks/member/members-table.svelte"
  import { Input } from "$lib/components/ui/input"
  import { Users } from "lucide-svelte"
  import type { LayoutData } from "./$types"
  import { queryParam } from "sveltekit-search-params"
  import InvitationsListButton from "$lib/components/blocks/invitations/invitations-list-button.svelte"
  import { hasPermission } from "$lib/store/workspace-member.store"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"

  const mq = queryParam("mq")

  export let data: LayoutData
  $: getMembersStore = data.getMembersStore

  $: members = $getMembersStore.data?.members ?? []

  function fetchMembers() {
    getMembersStore.fetch({ variables: { q: $mq } })
  }

  $: store = data.indexDataStore
  onMount(async () => {
    if ($store.data?.space?.isPersonal) {
      await goto("/", { replaceState: true })
    }
  })
</script>

<main class="space-y-2 p-6">
  <div class="flex justify-between">
    <div class="space-y-2">
      <h3 class="flex items-center text-xl">
        <Users class="mr-2 h-4 w-4" />
        Members
      </h3>

      <Input bind:value={$mq} on:change={fetchMembers} placeholder="Search Members..." class="max-w-xs" />
    </div>

    <div class="flex items-center gap-2">
      {#if $hasPermission("authz:invite")}
        <InviteButton />
      {/if}
      {#if $hasPermission("authz:listInvitation")}
        <InvitationsListButton />
      {/if}
    </div>
  </div>

  <MembersTable {members} />
</main>
