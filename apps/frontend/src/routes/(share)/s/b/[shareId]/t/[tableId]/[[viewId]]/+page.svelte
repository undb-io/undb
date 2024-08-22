<script lang="ts">
  import { page } from "$app/stores"
  import GridViewDataTable from "$lib/components/blocks/grid-view/grid-view-data-table.svelte"
  import { recordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { Records, type IRecordsDTO } from "@undb/table"
  import { onMount, type ComponentType } from "svelte"
  import { derived, writable, readable } from "svelte/store"

  let RecordDetailSheet: ComponentType

  let viewId = derived(page, (page) => page.params.viewId)
  onMount(async () => {
    RecordDetailSheet = (await import("$lib/components/blocks/record-detail/share-record-detail-sheet.svelte")).default
  })

  const t = getTable()

  const perPage = writable(50)
  const currentPage = writable(1)

  const getRecords = createQuery(
    derived([t, perPage, currentPage, viewId, page], ([$table, $perPage, $currentPage, $viewId, $page]) => {
      return {
        queryKey: ["records", $table?.id.value, $viewId, $currentPage, $perPage],
        queryFn: () =>
          trpc.shareData.records.query({
            shareId: $page.params.shareId,
            tableId: $page.params.tableId,
            viewId: $viewId,
          }),
      }
    }),
  )

  $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []

  let store = recordsStore
  $: if ($getRecords.isSuccess) {
    store.set(Records.fromJSON($t, records), $getRecords.dataUpdatedAt)
  }
</script>

<GridViewDataTable
  {viewId}
  readonly
  {perPage}
  {currentPage}
  isLoading={$getRecords.isLoading}
  total={$getRecords.data?.total ?? 0}
/>

{#if RecordDetailSheet}
  <RecordDetailSheet readonly />
{/if}
