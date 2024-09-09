<script lang="ts">
  import { page } from "$app/stores"
  import GridViewDataTable from "$lib/components/blocks/grid-view/grid-view-data-table.svelte"
  import ShareTableTools from "$lib/components/blocks/table-tools/share-table-tools.svelte"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { Records, type IRecordsDTO } from "@undb/table"
  import { onMount, type ComponentType } from "svelte"
  import { derived, writable } from "svelte/store"
  import { queryParam } from "sveltekit-search-params"
  import { isDataTab, isFormTab } from "$lib/store/tab.store"
  import ShareTableHeader from "$lib/components/blocks/table-header/share-table-header.svelte"
  import FormsReadonly from "$lib/components/blocks/forms/forms-readonly.svelte"
  import { createRecordsStore, setRecordsStore } from "$lib/store/records.store"

  let RecordDetailSheet: ComponentType

  let viewId = derived(page, (page) => page.params.viewId)
  onMount(async () => {
    RecordDetailSheet = (await import("$lib/components/blocks/record-detail/share-record-detail-sheet.svelte")).default
  })

  const t = getTable()

  const perPage = writable(50)
  const currentPage = writable(1)
  const q = queryParam("q")

  const getRecords = createQuery(
    derived([t, perPage, currentPage, viewId, page, q], ([$table, $perPage, $currentPage, $viewId, $page, $q]) => {
      return {
        queryKey: ["records", $table?.id.value, $viewId, $currentPage, $perPage, $q],
        queryFn: () =>
          trpc.shareData.records.query({
            shareId: $page.params.shareId,
            tableId: $table.id.value,
            viewId: $viewId,
            q: $q,
          }),
      }
    }),
  )

  $: records = (($getRecords.data as any)?.records as IRecordsDTO) ?? []

  $: if ($getRecords.isSuccess) {
    const store = createRecordsStore()
    store.setRecords(Records.fromJSON($t, records), $getRecords.dataUpdatedAt)
    setRecordsStore(store)
  }
</script>

<div class="flex flex-1 flex-col">
  <ShareTableHeader />
  <ShareTableTools />

  {#if $isDataTab}
    <GridViewDataTable
      {viewId}
      readonly
      {perPage}
      {currentPage}
      isLoading={$getRecords.isLoading}
      total={$getRecords.data?.total ?? 0}
    />
  {:else if $isFormTab}
    <FormsReadonly />
  {/if}

  {#if RecordDetailSheet}
    <RecordDetailSheet readonly />
  {/if}
</div>
