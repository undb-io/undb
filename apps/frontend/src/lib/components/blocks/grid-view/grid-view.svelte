<script lang="ts">
  import { derived, writable, type Readable } from "svelte/store"
  import { createRecordsStore, setRecordsStore, type RecordsStore } from "$lib/store/records.store"
  import { Records, type IRecordsDTO, type IViewFilterGroup } from "@undb/table"
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import { queryParam } from "sveltekit-search-params"
  import GridViewDataTable from "./grid-view-data-table.svelte"

  export let readonly = false

  const t = getTable()
  export let viewId: Readable<string>

  const q = queryParam("q")
  export let filter: IViewFilterGroup | undefined = undefined

  const perPage = writable(50)
  const currentPage = writable(1)

  const getRecords = createQuery(
    derived([t, viewId, perPage, currentPage, q], ([$table, $viewId, $perPage, $currentPage, $q]) => {
      const view = $table.views.getViewById($viewId)
      return {
        queryKey: ["records", $table?.id.value, $viewId, $q, $currentPage, $perPage],
        enabled: view?.type === "grid",
        queryFn: () =>
          trpc.record.list.query({
            tableId: $table?.id.value,
            viewId: $viewId,
            q: $q ?? undefined,
            filters: filter,
            pagination: { limit: $perPage, page: $currentPage },
          }),
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
</script>

<GridViewDataTable
  {viewId}
  {readonly}
  {perPage}
  {currentPage}
  isLoading={$getRecords.isLoading}
  total={$getRecords.data?.total ?? 0}
/>


{#await import("$lib/components/blocks/create-record/create-record-sheet.svelte") then { default: CreateRecordSheet }}
  <CreateRecordSheet />
{/await}

{#await import("$lib/components/blocks/record-detail/table-record-detail-sheet.svelte") then { default: TableRecordDetailSheet }}
  <TableRecordDetailSheet />
{/await}