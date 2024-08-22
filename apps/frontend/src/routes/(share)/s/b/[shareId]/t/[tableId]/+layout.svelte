<script lang="ts">
  import { TableCreator, TableDo } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store"

  export let data: LayoutData
  $: tableStore = data.getBaseTableShareData

  $: fetching = $tableStore.fetching
  $: tableDTO = $tableStore.data?.tableByShareBase
  $: share = $tableStore.data?.share

  const table = writable<TableDo>()
  $: {
    if (!fetching && tableDTO) {
      table.set(new TableCreator().fromJSON(tableDTO))
      setTable(table)
    }
  }

  $: if (share) {
    $shareStore.set(share.id, share)
  }
</script>

<main class="flex h-screen flex-1 flex-col overflow-hidden">
  {#if $table}
    <slot />
  {/if}
</main>

<style>
  :global(html) {
    height: 100vh;
  }
  :global(body) {
    height: 100vh;
  }
</style>
