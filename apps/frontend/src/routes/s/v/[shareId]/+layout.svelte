<script lang="ts">
  import { page } from "$app/stores"
  import { TableCreator, TableDo } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store"
  import { aggregatesStore } from "$lib/store/aggregates.store"
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"

  export let data: LayoutData
  $: tableStore = data.getViewShareData

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

  const getAggregates = createQuery({
    queryKey: [share?.id, "aggregates", tableDTO?.id],
    queryFn: () => trpc.record.aggregate.query({ tableId: tableDTO!.id, viewId: share!.target.id }),
    enabled: !!share && !!tableDTO,
  })

  if ($getAggregates.data && tableDTO) {
    aggregatesStore.updateTableAggregates(tableDTO.id, $getAggregates.data)
  }
</script>

<main class="flex h-screen flex-1 flex-col overflow-hidden">
  {#if $table}
    <slot />
  {/if}
</main>
