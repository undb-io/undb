<script lang="ts">
  import { page } from "$app/stores"
  import GridViewDataTable from "$lib/components/blocks/grid-view/grid-view-data-table.svelte"
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
  import ShareGridView from "$lib/components/blocks/share/share-grid-view.svelte"
  import ShareGalleryView from "$lib/components/blocks/share/share-gallery-view.svelte"
  import ShareKanbanView from "$lib/components/blocks/share/share-kanban-view.svelte"

  let RecordDetailSheet: ComponentType

  let viewId = derived(page, (page) => page.params.viewId)
  let shareId = derived(page, (page) => page.params.shareId)
  onMount(async () => {
    RecordDetailSheet = (await import("$lib/components/blocks/record-detail/share-record-detail-sheet.svelte")).default
  })

  const t = getTable()

  $: view = $t.views.getViewById($viewId)

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

  const store = createRecordsStore()
  setRecordsStore(store)
  $: if ($getRecords.isSuccess) {
    store.setRecords(Records.fromJSON($t, records), $getRecords.dataUpdatedAt)
  }
</script>

<div class="flex flex-1 flex-col">
  <ShareTableHeader />

  {#if $isDataTab}
    {#if view?.type === "grid"}
      <ShareGridView {viewId} />
    {:else if view.type === "kanban"}
      <ShareKanbanView {viewId} shareId={$shareId} />
    {:else if view.type === "gallery"}
      <ShareGalleryView {viewId} shareId={$shareId} />
    {/if}
  {:else if $isFormTab}
    <FormsReadonly />
  {/if}

  {#if RecordDetailSheet}
    <RecordDetailSheet readonly />
  {/if}
</div>
