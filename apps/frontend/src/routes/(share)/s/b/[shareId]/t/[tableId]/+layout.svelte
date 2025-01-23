<script lang="ts">
  import { TableFactory, TableDo } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store.svelte"
  import { goto } from "$app/navigation"

  export let data: LayoutData
  $: tableStore = data.getBaseTableShareData

  $: fetching = $tableStore.fetching
  $: tableDTO = $tableStore.data?.tableByShareBase
  $: hasError = $tableStore.errors?.length
  $: share = $tableStore.data?.share

  const table = writable<TableDo>()
  $: {
    if (!fetching && tableDTO) {
      // @ts-ignore
      table.set(new TableFactory().fromJSON(tableDTO))
      setTable(table)
    }
  }

  $: if (share) {
    $shareStore.set(share.id, share)
  }

  $: if (hasError) {
    console.error(hasError)
    goto("/")
  }
</script>

<main class="flex h-full flex-col overflow-hidden">
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
