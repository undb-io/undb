<script lang="ts">
  import MembersTable from "$lib/components/blocks/member/members-table.svelte"
  import { Input } from "$lib/components/ui/input"
  import type { LayoutData } from "./$types"
  import { queryParam } from "sveltekit-search-params"

  const mq = queryParam("mq")

  export let data: LayoutData
  $: getMembersStore = data.getMembersStore

  $: members = $getMembersStore.data?.members ?? []

  function fetchMembers() {
    getMembersStore.fetch({ variables: { q: $mq } })
  }
</script>

<main class="space-y-2 p-6">
  <h3 class="text-xl">Members</h3>

  <Input bind:value={$mq} on:change={fetchMembers} placeholder="Search Members..." class="max-w-xs" />

  <MembersTable {members} />
</main>
