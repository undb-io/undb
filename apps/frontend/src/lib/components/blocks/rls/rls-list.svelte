<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import CreateRlsButton from "./create-rls-button.svelte"
  import RlsCard from "./rls-card.svelte"

  const table = getTable()

  $: rlsGroup = $table.rls.into(undefined)?.props ?? []
</script>

<div
  class="mx-auto grid w-[500px] gap-3 pt-6
"
>
  <div class="flex w-full justify-end">
    <CreateRlsButton variant="list" size="sm" />
  </div>
  <div class="space-y-2">
    {#each rlsGroup as rls}
      <RlsCard {rls} />
    {/each}
  </div>
</div>
