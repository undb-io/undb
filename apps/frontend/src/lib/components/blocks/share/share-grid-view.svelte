<script lang="ts">
  import { page } from "$app/stores"
  import GridViewDataTable from "$lib/components/blocks/grid-view/grid-view-data-table.svelte"
  import { recordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { Records, type IRecordsDTO } from "@undb/table"
  import { derived, writable, type Readable } from "svelte/store"

  export let viewId: Readable<string>

  const t = getTable()

  const perPage = writable(50)
  const currentPage = writable(1)

  const getRecords = createQuery(
    derived([t, perPage, currentPage, page], ([$table, $perPage, $currentPage, $page]) => {
      return {
        queryKey: ["records", $table?.id.value, $currentPage, $perPage],
        queryFn: () =>
          trpc.shareData.records.query({
            shareId: $page.params.shareId,
            pagination: {
              page: $currentPage,
              limit: $perPage,
            },
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
