<script lang="ts">
  import { page } from "$app/stores"
  import { TableDo, tableCreator } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"

  export let data: LayoutData
  $: tableStore = data.tableStore

  $: fetching = $tableStore.fetching
  $: tableDTO = $tableStore.data?.table

  const table = writable<TableDo>()
  $: {
    if (!fetching && tableDTO && $page.params.tableId === tableDTO.id) {
      table.set(tableCreator.fromJSON(tableDTO))
      setTable(table)
    }
  }
</script>

<main class="flex h-screen flex-1 flex-col overflow-hidden">
  {#if $table}
    <slot />
  {/if}
</main>
