<script lang="ts">
  import { page } from "$app/stores"
  import { TableCreator, TableDo } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store"

  export let data: LayoutData
  $: tableStore = data.getFormShareData

  $: fetching = $tableStore.fetching
  $: tableDTO = $tableStore.data?.tableByShare
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

{#if $table}
  <slot />
{/if}
