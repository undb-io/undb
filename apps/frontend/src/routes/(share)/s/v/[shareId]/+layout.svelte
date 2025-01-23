<script lang="ts">
  import { TableFactory, TableDo } from "@undb/table"
  import { setTable } from "$lib/store/table.store"
  import type { LayoutData } from "./$types"
  import { derived, writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store.svelte"
  import { aggregatesStore } from "$lib/store/aggregates.store"
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { page } from "$app/stores"

  export let data: LayoutData
  $: tableStore = data.getViewShareData

  $: fetching = $tableStore.fetching
  $: tableDTO = $tableStore.data?.tableByShare
  $: share = $tableStore.data?.share

  const table = writable<TableDo>()
  $: {
    if (!fetching && tableDTO) {
      table.set(new TableFactory().fromJSON(tableDTO))
      setTable(table)
    }
  }

  $: if (share) {
    $shareStore.set(share.id, share)
  }

  const getAggregates = createQuery(
    derived([table], ([$table]) => ({
      queryKey: [share?.id, "aggregates", tableDTO?.id],
      queryFn: () =>
        trpc.shareData.aggregate.query({ shareId: share!.id, tableId: $table.id.value, viewId: share!.target.id }),
      enabled: !!share && !!$table,
    })),
  )

  const viewId = derived([shareStore, page], ([$shareStore, $page]) => {
    const share = $shareStore.get($page.params.shareId)
    return share?.target.id!
  })

  $: if ($getAggregates.data && $table) {
    aggregatesStore.updateTableAggregates($viewId ?? $table.views.getDefaultView()?.id.value, $getAggregates.data)
  }
</script>

<main class="flex h-screen flex-1 flex-col overflow-hidden">
  {#if $table}
    <slot />
  {/if}
</main>
