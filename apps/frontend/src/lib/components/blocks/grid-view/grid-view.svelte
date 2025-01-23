<script lang="ts">
  import { derived, type Readable, type Writable } from "svelte/store"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"
  import { Records, type IRecordsDTO, type IViewFilterGroup } from "@undb/table"
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { queryParam, ssp } from "sveltekit-search-params"
  import GridViewDataTable from "./grid-view-data-table.svelte"
  import { preferences } from "$lib/store/persisted.store"
  import { aggregatesStore } from "$lib/store/aggregates.store"
  import { getDataService } from "$lib/store/data-service.store"

  export let readonly = false

  const t = getTable()
  export let viewId: Readable<string | undefined>
  export let r: Writable<string | null>
  export let shareId: string | undefined = undefined

  const q = queryParam("q")
  export let filter: IViewFilterGroup | undefined = undefined

  const perPage = derived(preferences, ($preferences) => $preferences.gridViewPerPage ?? 50)
  const currentPage = queryParam("page", ssp.number())

  const dataService = getDataService()

  const getRecords = createQuery(
    derived([t, viewId, perPage, currentPage, q], ([$table, $viewId, $perPage, $currentPage, $q]) => {
      const view = $table.views.getViewById($viewId)
      return {
        queryKey: ["records", $table?.id.value, $viewId, $q, $currentPage, $perPage],
        enabled: view?.type === "grid",
        queryFn: async () => {
          return dataService.records.getRecords({
            tableId: $table?.id.value,
            viewId: $viewId,
            q: $q ?? undefined,
            filters: filter,
            pagination: { limit: $perPage, page: $currentPage || 1 },
          })
        },
      }
    }),
  )

  // TODO: record type
  $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []

  const store = createRecordsStore()
  setRecordsStore(store)

  $: if ($getRecords.isSuccess) {
    store.setRecords(Records.fromJSON($t, records), $getRecords.dataUpdatedAt)
  }

  const getAggregates = createQuery(
    derived([t], ([$table]) => {
      if (shareId) {
        return {
          queryKey: ["aggregates", $table?.id.value, $viewId],
          queryFn: () => trpc.shareData.aggregate.query({ shareId, tableId: $table.id.value, viewId: $viewId }),
          enabled: !!$table,
        }
      }
      return {
        queryKey: ["aggregates", $table?.id.value, $viewId],
        queryFn: async () => {
          return dataService.records.getAggregates({ tableId: $table.id.value, viewId: $viewId })
        },
        enabled: !!$table,
      }
    }),
  )

  $: if ($getAggregates.data && $t) {
    aggregatesStore.updateTableAggregates($viewId ?? $t.views.getDefaultView()?.id.value, $getAggregates.data)
  }
</script>

<GridViewDataTable
  {viewId}
  {readonly}
  {perPage}
  {currentPage}
  {r}
  {shareId}
  isLoading={$getRecords.isLoading}
  total={$getRecords.data?.total ?? 0}
/>
