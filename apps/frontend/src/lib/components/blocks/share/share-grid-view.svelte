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

  export let viewId: Readable<string | undefined>

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
</script>

{#if store}
  <GridViewDataTable
    {viewId}
    readonly
    {perPage}
    {currentPage}
    isLoading={$getRecords.isLoading}
    total={$getRecords.data?.total ?? 0}
  />
{/if}
