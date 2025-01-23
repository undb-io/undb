<script lang="ts">
  import { page } from "$app/stores"
  import GridViewDataTable from "$lib/components/blocks/grid-view/grid-view-data-table.svelte"
  import { preferences } from "$lib/store/persisted.store"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { Records, type IRecordsDTO } from "@undb/table"
  import { derived, type Readable } from "svelte/store"
  import { queryParam, ssp } from "sveltekit-search-params"
  import { r } from "$lib/store/records.store"
  import { aggregatesStore } from "$lib/store/aggregates.store"

  export let viewId: Readable<string | undefined>
  export let shareId: string

  const t = getTable()
  const perPage = derived(preferences, ($preferences) => $preferences.gridViewPerPage ?? 50)
  const currentPage = queryParam("page", ssp.number())
  const q = queryParam("q")

  const getRecords = createQuery(
    derived([t, perPage, currentPage, page, q], ([$table, $perPage, $currentPage, $page, $q]) => {
      return {
        queryKey: ["records", $table?.id.value, $currentPage, $perPage, $q],
        queryFn: () =>
          trpc.shareData.records.query({
            shareId: $page.params.shareId,
            tableId: $table.id.value,
            viewId: $viewId,
            q: $q,
            pagination: {
              page: $currentPage ?? 1,
              limit: $perPage,
            },
          }),
        enabled: !!$perPage,
      }
    }),
  )

  $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []

  let store = createRecordsStore()
  setRecordsStore(store)

  $: if ($getRecords.isSuccess) {
    store.setRecords(Records.fromJSON($t, records), $getRecords.dataUpdatedAt)
  }

  const getAggregates = createQuery(
    derived([t], ([$table]) => {
      return {
        queryKey: ["aggregates", $table?.id.value, $viewId],
        queryFn: () => trpc.shareData.aggregate.query({ shareId, tableId: $table.id.value, viewId: $viewId }),
        enabled: !!$table,
      }
    }),
  )
  $: if ($getAggregates.data && $t) {
    aggregatesStore.updateTableAggregates($viewId ?? $t.views.getDefaultView()?.id.value, $getAggregates.data)
  }
</script>

{#if store}
  <GridViewDataTable
    {viewId}
    {r}
    readonly
    {perPage}
    {currentPage}
    {shareId}
    isLoading={$getRecords.isLoading}
    total={$getRecords.data?.total ?? 0}
  />
{/if}

{#await import("$lib/components/blocks/view-widget/view-widget-sheet.svelte") then { default: ViewWidgetSheet }}
  <ViewWidgetSheet {viewId} {shareId} readonly />
{/await}
