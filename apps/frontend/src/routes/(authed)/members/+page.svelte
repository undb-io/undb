<script lang="ts">
  import type { GetMembers$result } from "$houdini"
  import type { LayoutData } from "./$types"

  export let data: LayoutData
  $: getMembersStore = data.getMembersStore

  $: members = $getMembersStore.data?.members ?? []
</script>

<main class="p-6">
  <h3 class="text-xl">Members</h3>

  {#each members as member}
    {#if member}
      <p>{member.role}</p>
    {/if}
  {/each}
</main>
