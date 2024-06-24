<script lang="ts">
  import { page } from "$app/stores"
  import { TableCreator, TableDo } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store"

  export let data: LayoutData
  $: tableStore = data.tableStore

  $: fetching = $tableStore.fetching
  $: tableDTO = $tableStore.data?.table

  const table = writable<TableDo>()
  $: {
    if (!fetching && tableDTO && $page.params.tableId === tableDTO.id) {
      table.set(new TableCreator().fromJSON(tableDTO))
      setTable(table)
    }
  }

  $: if (tableDTO) {
    for (const view of tableDTO.views) {
      if (view.share) {
        $shareStore.set(view.id, view.share)
      }
    }

    for (const form of tableDTO.forms ?? []) {
      if (form?.share) {
        $shareStore.set(form.id, form.share)
      }
    }
  }
</script>

<main class="flex h-screen flex-1 flex-col overflow-hidden">
  {#if $table}
    <slot />
  {/if}
</main>
